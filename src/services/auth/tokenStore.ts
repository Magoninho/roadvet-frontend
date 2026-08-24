import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'roadvet.sync.authToken';

/**
 * Placeholder token store for authenticating sync requests. No login flow
 * populates this yet — setAuthToken() is here so a real auth integration
 * has somewhere to write the token once the backend exists.
 */
export async function getAuthToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
