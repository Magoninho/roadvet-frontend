import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '@/database';
import { ApiError } from '@/services/api/client';
import { pullChanges, pushChanges } from './api';
import { getSyncStatus, setSyncStatus } from './status';

let syncPromise: Promise<void> | null = null;

function formatSyncErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const body = error.body;
    if (typeof body === 'string' && body.trim().length > 0) return body;
    if (Array.isArray(body) && typeof body[0] === 'string') return body[0];
    if (body && typeof body === 'object') {
      const obj = body as Record<string, unknown>;
      if (typeof obj.detail === 'string') return obj.detail;
      if (typeof obj.error === 'string') return obj.error;
      for (const value of Object.values(obj)) {
        if (typeof value === 'string') return value;
        if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
      }
    }
    return `Erro ${error.status}: ${error.message}`;
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

function isFatalClientError(error: unknown): boolean {
  if (error instanceof ApiError) {
    // 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity
    return error.status >= 400 && error.status < 500;
  }
  return false;
}

/**
 * Runs a full WatermelonDB sync cycle against the cloud API. Safe to call
 * repeatedly (e.g. from network/foreground triggers) — concurrent calls
 * share the in-flight sync instead of racing.
 */
export function synchronizeDatabase(): Promise<void> {
  if (syncPromise) return syncPromise;

  const { lastSyncedAt } = getSyncStatus();
  setSyncStatus({ state: 'syncing', lastSyncedAt, error: null, isFatal: false });

  syncPromise = synchronize({
    database,
    pullChanges,
    pushChanges,
    sendCreatedAsUpdated: true,
  })
    .then(() => {
      setSyncStatus({ state: 'success', lastSyncedAt: Date.now(), error: null, isFatal: false });
    })
    .catch((error: unknown) => {
      const errorMessage = formatSyncErrorMessage(error);
      const isFatal = isFatalClientError(error);
      setSyncStatus({
        state: 'error',
        lastSyncedAt,
        error: errorMessage,
        isFatal,
      });
      throw error;
    })
    .finally(() => {
      syncPromise = null;
    });

  return syncPromise;
}

