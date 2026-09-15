import Veterinario from '@/database/models/Veterinario';
import { hashPassword } from '@/database/repositories/password';
import {
  authenticateVeterinario,
  emailJaCadastrado,
  findVeterinarioById,
  generateVeterinarioId,
  RemoteVeterinarioProfile,
  upsertVeterinarioFromRemote,
  VeterinarioInput,
} from '@/database/repositories/veterinarios';
import { synchronizeDatabase } from '@/database/sync';
import { ApiError, apiRequest } from '@/services/api/client';
import { clearAuthTokens, setAuthTokens } from '@/services/auth/tokenStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SESSION_KEY = 'roadvet.session.veterinarioId';

export interface RegisterInput extends VeterinarioInput {
  senha: string;
}

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  veterinario: Veterinario | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface RemoteAuthResponse {
  access?: string;
  refresh?: string;
  veterinario?: RemoteVeterinarioProfile;
  id?: string;
  email?: string;
  first_name?: string;
  crmv?: string;
  phone?: string;
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
    // DRF field-validation errors, e.g. {"password": ["..."]} or {"username": ["..."]}.
    for (const value of Object.values(obj)) {
      if (typeof value === 'string') return value;
      if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    }
  }
  return fallback;
}

async function completeRemoteAuth(
  response: RemoteAuthResponse,
  fallbackData: { email: string; nome: string; crmv?: string | null; phone?: string | null },
  senhaHash?: string
): Promise<Veterinario> {
  if (response.access && response.refresh) {
    await setAuthTokens({ access: response.access, refresh: response.refresh });
  }

  // Monta o perfil local caso a resposta do Django não traga o objeto veterinario aninhado
  const profile: RemoteVeterinarioProfile = response.veterinario ?? {
    id: response.id ? String(response.id) : generateVeterinarioId(),
    nome: response.first_name || fallbackData.nome,
    email: response.email || fallbackData.email,
    crmv: response.crmv ?? fallbackData.crmv ?? null,
    telefone: response.phone ?? fallbackData.phone ?? null,
  };

  const vet = await upsertVeterinarioFromRemote(profile, senhaHash);
  try {
    await synchronizeDatabase();
  } catch {
    // Best-effort: useSyncEngine retries once logged in and online.
  }
  await AsyncStorage.setItem(SESSION_KEY, vet.id);
  return vet;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [veterinario, setVeterinario] = useState<Veterinario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const savedId = await AsyncStorage.getItem(SESSION_KEY);
      if (savedId) {
        try {
          setVeterinario(await findVeterinarioById(savedId));
        } catch {
          await AsyncStorage.removeItem(SESSION_KEY);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (email: string, senha: string): Promise<AuthResult> => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // SimpleJWT exige 'username' e 'password'
      const response = await apiRequest<RemoteAuthResponse>('/api/token/', {
        method: 'POST',
        skipAuth: true,
        body: { username: normalizedEmail, password: senha },
      });

      const vet = await completeRemoteAuth(response, { email: normalizedEmail, nome: '' });
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
      setVeterinario(vet);
      return { ok: true };
    }
  };

  const register = async (input: RegisterInput): Promise<AuthResult> => {
    const email = input.email.trim().toLowerCase();
    if (await emailJaCadastrado(email)) {
      return { ok: false, error: 'Já existe um cadastro com este email.' };
    }

    const senhaHash = await hashPassword(input.senha);

    try {
      // Envia os campos esperados pelo model User do Django
      const registerResponse = await apiRequest<RemoteAuthResponse>('/api/users/', {
        method: 'POST',
        skipAuth: true,
        body: {
          username: email,
          email: email,
          password: input.senha,
          crmv: input.crmv ?? null,
          phone: input.telefone ?? null,
          first_name: input.nome,
        },
      });

      // Se a resposta de cadastro do Django não incluir os tokens JWT, realiza a autenticação na sequência
      let authResponse = registerResponse;
      if (!authResponse.access) {
        authResponse = await apiRequest<RemoteAuthResponse>('/api/token/', {
          method: 'POST',
          skipAuth: true,
          body: { username: email, password: input.senha },
        });
      }

      const vet = await completeRemoteAuth(
        authResponse,
        { email, nome: input.nome, crmv: input.crmv, phone: input.telefone },
        senhaHash
      );

      setVeterinario(vet);
      return { ok: true };
    } catch (error) {
      console.log('--- ERRO DETALHADO NO CADASTRO ---', error);
      
      const fallback = 'Não foi possível concluir o cadastro. Verifique sua conexão e tente novamente.';
      const detalheErro = error?.message || JSON.stringify(error);
      if (error instanceof ApiError) {
        return { ok: false, error: messageFromApiError(error, fallback) };
      }
      return { ok: false, error: fallback };
    }
  };

  const logout = async () => {
    await clearAuthTokens();
    await AsyncStorage.removeItem(SESSION_KEY);
    setVeterinario(null);
  };

  const value = useMemo(
    () => ({ veterinario, isLoading, login, register, logout }),
    [veterinario, isLoading],
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