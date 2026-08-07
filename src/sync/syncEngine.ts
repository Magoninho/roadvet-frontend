import { apiClient } from '../services/api/client';

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error';

class SyncStatusTracker {
  private currentState: SyncState = 'synced';
  private lastSyncedAt: number | null = Date.now();
  private listeners: Set<(state: SyncState) => void> = new Set();

  getState(): SyncState {
    return this.currentState;
  }

  getLastSyncedAt(): number | null {
    return this.lastSyncedAt;
  }

  setState(newState: SyncState) {
    this.currentState = newState;
    if (newState === 'synced') {
      this.lastSyncedAt = Date.now();
    }
    this.listeners.forEach((listener) => listener(newState));
  }

  subscribe(listener: (state: SyncState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const syncStatus = new SyncStatusTracker();

export async function runWatermelonSync(): Promise<void> {
  if (syncStatus.getState() === 'syncing') return;

  try {
    syncStatus.setState('syncing');

    // WatermelonDB synchronize() hook logic:
    // await synchronize({
    //   database,
    //   pullChanges: async ({ lastPulledAt }) => apiClient.pullSyncChanges(lastPulledAt),
    //   pushChanges: async ({ changes }) => apiClient.pushSyncChanges(changes),
    // });
    
    // Simulate background sync cycle
    await apiClient.pullSyncChanges(syncStatus.getLastSyncedAt());
    syncStatus.setState('synced');
  } catch (error) {
    console.error('[Sync Engine] Synchronization failed:', error);
    syncStatus.setState('error');
  }
}
