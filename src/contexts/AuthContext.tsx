import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
import { apiRequest, ApiError } from '@/services/api/client';
import { clearAuthTokens, setAuthTokens } from '@/services/auth/tokenStore';

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
  await setAuthTokens({ access: response.access, refresh: response.refresh });
  const vet = await upsertVeterinarioFromRemote(response.veterinario, senhaHash);
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
