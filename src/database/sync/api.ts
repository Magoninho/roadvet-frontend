import type { SyncPullArgs, SyncPullResult, SyncPushArgs, SyncPushResult } from '@nozbe/watermelondb/sync';
import { apiRequest } from '@/services/api/client';

export async function pullChanges({ lastPulledAt, schemaVersion, migration }: SyncPullArgs): Promise<SyncPullResult> {
  return apiRequest<SyncPullResult>('/sync', {
    method: 'GET',
    query: {
      last_pulled_at: lastPulledAt != null ? String(lastPulledAt) : undefined,
      schema_version: String(schemaVersion),
      migration: migration ? JSON.stringify(migration) : undefined,
    },
  });
}

export async function pushChanges({ changes, lastPulledAt }: SyncPushArgs): Promise<SyncPushResult | undefined> {
  return apiRequest<SyncPushResult>('/sync', {
    method: 'POST',
    query: { last_pulled_at: lastPulledAt != null ? String(lastPulledAt) : undefined },
    body: { changes },
  });
}