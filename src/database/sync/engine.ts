import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '@/database';
import { pullChanges, pushChanges } from './api';
import { getSyncStatus, setSyncStatus } from './status';

let syncPromise: Promise<void> | null = null;

/**
 * Runs a full WatermelonDB sync cycle against the cloud API. Safe to call
 * repeatedly (e.g. from network/foreground triggers) — concurrent calls
 * share the in-flight sync instead of racing.
 */
export function synchronizeDatabase(): Promise<void> {
  if (syncPromise) return syncPromise;

  const { lastSyncedAt } = getSyncStatus();
  setSyncStatus({ state: 'syncing', lastSyncedAt, error: null });

  syncPromise = synchronize({
    database,
    pullChanges,
    pushChanges,
    sendCreatedAsUpdated: true,
  })
    .then(() => {
      setSyncStatus({ state: 'success', lastSyncedAt: Date.now(), error: null });
    })
    .catch((error: unknown) => {
      setSyncStatus({
        state: 'error',
        lastSyncedAt,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    })
    .finally(() => {
      syncPromise = null;
    });

  return syncPromise;
}
