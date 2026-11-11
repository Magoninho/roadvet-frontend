import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { database, resetDatabase } from '@/database';
import Veterinario from '@/database/models/Veterinario';
import { cleanupAllLocalFiles } from '@/database/repositories/localFileStorage';
import { hashPassword } from '@/database/repositories/password';
import {
  authenticateVeterinario,
  emailJaCadastrado,
  findVeterinarioById,
  generateVeterinarioId,
  RemoteVeterinarioProfile,
  updateSenha,
  updateVeterinario,
  upsertVeterinarioFromRemote,
  VeterinarioInput,
} from '@/database/repositories/veterinarios';
import { resetSyncStatus, synchronizeDatabase } from '@/database/sync';
import { apiRequest, ApiError } from '@/services/api/client';
import { clearAuthTokens, setAuthTokens } from '@/services/auth/tokenStore';

const SESSION_KEY = 'roadvet.session.veterinarioId';
const LAST_USER_ID_KEY = 'roadvet.session.lastUserId';

export interface RegisterInput extends VeterinarioInput {
  senha: string;
}

export interface ProfileInput {
  nome: string;
  crmv: string | null;
  email: string;
  telefone: string | null;
}

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  veterinario: Veterinario | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
  /** Saves name/CRMV/email/phone. Works offline except for email changes, which the server must validate. */
  updateProfile: (input: ProfileInput) => Promise<AuthResult>;
  /** Requires a connection: the current password is checked by the server. */
  changePassword: (senhaAtual: string, novaSenha: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface RemoteAuthResponse {
  access: string;
  refresh: string;
  veterinario: RemoteVeterinarioProfile;
}

function messageFromApiError(error: ApiError, fallback: string): string {
  const body = error.body;
  if (typeof body === 'string') return body;
  if (Array.isArray(body)) {
    return typeof body[0] === 'string' ? body[0] : fallback;
  }
  if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>;
    if (typeof obj.detail === 'string') return obj.detail;
    // DRF field-validation errors, e.g. {"senha": ["Certifique-se de que..."]} or {"email": "..."}.
    for (const value of Object.values(obj)) {
      if (typeof value === 'string') return value;
      if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    }
  }
  return fallback;
}

async function completeRemoteAuth(response: RemoteAuthResponse, senhaHash?: string): Promise<Veterinario> {
  const newUserId = response.veterinario.id;
  const lastUserId = await AsyncStorage.getItem(LAST_USER_ID_KEY);

  let existingVets: Veterinario[] = [];
  try {
    existingVets = await database.get<Veterinario>('veterinarios').query().fetch();
  } catch {
    existingVets = [];
  }

  const isDifferentUser = (lastUserId && lastUserId !== newUserId) || existingVets.some((v) => v.id !== newUserId);

  if (isDifferentUser) {
    console.log(
      `[AuthContext] Troca de usuário detectada (anterior: ${lastUserId ?? 'desconhecido'}, novo: ${newUserId}). Resetando banco de dados local...`,
    );
    await resetDatabase();
    await cleanupAllLocalFiles();
    resetSyncStatus();
  }

  await setAuthTokens({ access: response.access, refresh: response.refresh });
  const vet = await upsertVeterinarioFromRemote(response.veterinario, senhaHash);

  await AsyncStorage.setItem(SESSION_KEY, vet.id);
  await AsyncStorage.setItem(LAST_USER_ID_KEY, vet.id);

  try {
    await synchronizeDatabase();
  } catch {
    // Best-effort: useSyncEngine retries once logged in and online.
  }

  return vet;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [veterinario, setVeterinario] = useState<Veterinario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Bumped on every change to the vet's row (local edit or sync pull) so consumers re-render
  // with the updated name/photo, since `veterinario` itself is the same mutable Model instance.
  const [profileVersion, setProfileVersion] = useState(0);

  useEffect(() => {
    if (!veterinario) return;
    const subscription = veterinario.observe().subscribe({
      next: () => setProfileVersion((version) => version + 1),
      error: () => {},
    });
    return () => subscription.unsubscribe();
  }, [veterinario]);

  useEffect(() => {
    (async () => {
      const savedId = await AsyncStorage.getItem(SESSION_KEY);
      if (savedId) {
        try {
          const vet = await findVeterinarioById(savedId);
          setVeterinario(vet);
          await AsyncStorage.setItem(LAST_USER_ID_KEY, vet.id);
        } catch {
          await AsyncStorage.multiRemove([SESSION_KEY, LAST_USER_ID_KEY]);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (email: string, senha: string): Promise<AuthResult> => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const response = await apiRequest<RemoteAuthResponse>('/auth/login', {
        method: 'POST',
        skipAuth: true,
        body: { email: normalizedEmail, senha },
      });

      const vet = await completeRemoteAuth(response);
      setVeterinario(vet);
      return { ok: true };
    } catch (error) {
      if (error instanceof ApiError && (error.status === 400 || error.status === 401)) {
        return { ok: false, error: messageFromApiError(error, 'Email ou senha inválidos.') };
      }

      // Server unreachable: fall back to the local offline-auth check.
      const vet = await authenticateVeterinario(normalizedEmail, senha);
      if (!vet) {
        return { ok: false, error: 'Sem conexão com o servidor e nenhum cadastro local encontrado para este email.' };
      }
      await AsyncStorage.setItem(SESSION_KEY, vet.id);
      await AsyncStorage.setItem(LAST_USER_ID_KEY, vet.id);
      setVeterinario(vet);
      return { ok: true };
    }
  };

  const register = async (input: RegisterInput): Promise<AuthResult> => {
    const email = input.email.trim().toLowerCase();
    if (await emailJaCadastrado(email)) {
      return { ok: false, error: 'Já existe um cadastro com este email.' };
    }

    const id = generateVeterinarioId();
    const senhaHash = await hashPassword(input.senha);

    try {
      const response = await apiRequest<RemoteAuthResponse>('/auth/register', {
        method: 'POST',
        skipAuth: true,
        body: {
          id,
          nome: input.nome,
          crmv: input.crmv ?? null,
          email,
          telefone: input.telefone ?? null,
          senha: input.senha,
        },
      });

      const vet = await completeRemoteAuth(response, senhaHash);
      setVeterinario(vet);
      return { ok: true };
    } catch (error) {
      const fallback = 'Não foi possível concluir o cadastro. Verifique sua conexão e tente novamente.';
      if (error instanceof ApiError) {
        return { ok: false, error: messageFromApiError(error, fallback) };
      }
      return { ok: false, error: fallback };
    }
  };

  const logout = async () => {
    try {
      await resetDatabase();
      await cleanupAllLocalFiles();
    } catch (error) {
      console.error('[AuthContext] Erro ao resetar o banco de dados durante o logout:', error);
    } finally {
      await clearAuthTokens();
      await AsyncStorage.multiRemove([SESSION_KEY, LAST_USER_ID_KEY]);
      resetSyncStatus();
      setVeterinario(null);
    }
  };

  const updateProfile = async (input: ProfileInput): Promise<AuthResult> => {
    if (!veterinario) return { ok: false, error: 'Nenhum usuário autenticado.' };

    const email = input.email.trim().toLowerCase();
    const emailChanged = email !== veterinario.email;
    const body = {
      nome: input.nome.trim(),
      crmv: input.crmv?.trim() || null,
      email,
      telefone: input.telefone?.trim() || null,
    };

    try {
      const response = await apiRequest<RemoteVeterinarioProfile>('/auth/me', { method: 'PATCH', body });
      await upsertVeterinarioFromRemote(response);
      return { ok: true };
    } catch (error) {
      if (error instanceof ApiError) {
        return { ok: false, error: messageFromApiError(error, 'Não foi possível salvar o perfil.') };
      }
      if (emailChanged) {
        return { ok: false, error: 'Conecte-se à internet para alterar o email.' };
      }
      // Offline: save locally; the next sync pushes nome/crmv/telefone to the server.
      await updateVeterinario(veterinario, { nome: body.nome, crmv: body.crmv, telefone: body.telefone });
      return { ok: true };
    }
  };

  const changePassword = async (senhaAtual: string, novaSenha: string): Promise<AuthResult> => {
    if (!veterinario) return { ok: false, error: 'Nenhum usuário autenticado.' };

    try {
      await apiRequest('/auth/me/password', {
        method: 'POST',
        body: { senha_atual: senhaAtual, nova_senha: novaSenha },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return { ok: false, error: messageFromApiError(error, 'Não foi possível alterar a senha.') };
      }
      return { ok: false, error: 'Conecte-se à internet para alterar a senha.' };
    }

    // Keeps the offline-login fallback in step with the new password.
    await updateSenha(veterinario, novaSenha);
    return { ok: true };
  };

  const value = useMemo(
    () => ({ veterinario, isLoading, login, register, logout, updateProfile, changePassword }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [veterinario, isLoading, profileVersion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return ctx;
}

