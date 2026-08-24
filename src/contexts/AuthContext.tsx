import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Veterinario from '@/database/models/Veterinario';
import {
  authenticateVeterinario,
  createVeterinario,
  emailJaCadastrado,
  findVeterinarioById,
  VeterinarioInput,
} from '@/database/repositories/veterinarios';

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
    const vet = await authenticateVeterinario(email.trim().toLowerCase(), senha);
    if (!vet) {
      return { ok: false, error: 'Email ou senha inválidos.' };
    }
    await AsyncStorage.setItem(SESSION_KEY, vet.id);
    setVeterinario(vet);
    return { ok: true };
  };

  const register = async (input: RegisterInput): Promise<AuthResult> => {
    const email = input.email.trim().toLowerCase();
    if (await emailJaCadastrado(email)) {
      return { ok: false, error: 'Já existe um cadastro com este email.' };
    }
    const vet = await createVeterinario({ ...input, email }, input.senha);
    await AsyncStorage.setItem(SESSION_KEY, vet.id);
    setVeterinario(vet);
    return { ok: true };
  };

  const logout = async () => {
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
