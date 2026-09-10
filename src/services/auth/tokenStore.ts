import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'roadvet.sync.authToken';
const REFRESH_TOKEN_KEY = 'roadvet.sync.refreshToken';

// expo-secure-store's web target is an empty stub (no Keychain/Keystore
// equivalent exists in the browser) — fall back to AsyncStorage there,
// which is itself backed by localStorage on web.
const isWeb = Platform.OS === 'web';

async function getItem(key: string): Promise<string | null> {
  return isWeb ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) await AsyncStorage.setItem(key, value);
  else await SecureStore.setItemAsync(key, value);
}

async function removeItem(key: string): Promise<void> {
  if (isWeb) await AsyncStorage.removeItem(key);
  else await SecureStore.deleteItemAsync(key);
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export async function getAuthToken(): Promise<string | null> {
  return getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_TOKEN_KEY);
}

export async function setAuthTokens(tokens: AuthTokens): Promise<void> {
  await setItem(ACCESS_TOKEN_KEY, tokens.access);
  await setItem(REFRESH_TOKEN_KEY, tokens.refresh);
}

export async function setAuthToken(token: string): Promise<void> {
  await setItem(ACCESS_TOKEN_KEY, token);
}

export async function clearAuthTokens(): Promise<void> {
  await removeItem(ACCESS_TOKEN_KEY);
  await removeItem(REFRESH_TOKEN_KEY);
}
