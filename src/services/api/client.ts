import { Platform } from 'react-native';
import {
  clearAuthTokens,
  getAuthToken,
  getRefreshToken,
  setAuthTokens,
} from '@/services/auth/tokenStore';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      'EXPO_PUBLIC_API_URL is not set. Configure the cloud API base URL in .env before syncing.',
    );
  }
  return url.replace(/\/+$/, '');
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  query?: Record<string, string | undefined>;
  body?: unknown;
  /** Skip attaching a bearer token (used by /auth/login and /auth/register). */
  skipAuth?: boolean;
  /** Internal: prevents infinite refresh loops. */
  _retried?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

/**
 * Exchanges the stored refresh token for a new access token. Concurrent
 * callers share the same in-flight refresh instead of racing.
 */
async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = await getRefreshToken();
    if (!refresh) return null;

    try {
      const url = new URL(`${getBaseUrl()}/auth/refresh`);
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!response.ok) {
        await clearAuthTokens();
        return null;
      }
      const data = (await response.json()) as { access: string };
      await setAuthTokens({ access: data.access, refresh });
      return data.access;
    } catch {
      return null;
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

/**
 * Minimal JSON HTTP client for the cloud API (auth + sync). Attaches a
 * bearer token when one is available, and transparently refreshes it and
 * retries once on a 401 before giving up.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${getBaseUrl()}${path}`);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value);
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (!options.skipAuth) {
    const token = await getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401 && !options.skipAuth && !options._retried) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      return apiRequest<T>(path, { ...options, _retried: true });
    }
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed with status ${response.status}`, response.status, data);
  }

  return data as T;
}

/** Uploads a single file as multipart/form-data (used for anexo and avatar uploads). */
export async function apiUpload<T>(
  path: string,
  file: { uri: string; name: string; type?: string },
  _retried = false,
): Promise<T> {
  const url = new URL(`${getBaseUrl()}${path}`);
  const token = await getAuthToken();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const form = new FormData();
  if (Platform.OS === 'web') {
    // Web's FormData/fetch require a real Blob/File -- the `{ uri, name, type }`
    // object below is a React Native-only fetch polyfill convention that
    // silently serializes to a useless string on web instead of file bytes.
    const blob = await (await fetch(file.uri)).blob();
    form.append('file', blob, file.name);
  } else {
    form.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type ?? 'application/octet-stream',
    } as unknown as Blob);
  }

  const response = await fetch(url.toString(), { method: 'POST', headers, body: form });

  if (response.status === 401 && !_retried) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      return apiUpload<T>(path, file, true);
    }
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    throw new ApiError(`Upload to ${path} failed with status ${response.status}`, response.status, data);
  }

  return data as T;
}
