import { getAuthToken } from '@/services/auth/tokenStore';

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
  method?: 'GET' | 'POST';
  query?: Record<string, string | undefined>;
  body?: unknown;
}

/**
 * Minimal JSON HTTP client for the cloud sync API. Attaches a bearer token
 * when one is available; requests are unauthenticated otherwise since no
 * real login flow issues tokens yet.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${getBaseUrl()}${path}`);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value);
  }

  const token = await getAuthToken();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed with status ${response.status}`, response.status, data);
  }

  return data as T;
}
