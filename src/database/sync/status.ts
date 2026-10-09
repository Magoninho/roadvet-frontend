import { BehaviorSubject } from 'rxjs';

export type SyncState = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncStatus {
  state: SyncState;
  lastSyncedAt: number | null;
  error: string | null;
  isFatal?: boolean;
}

const initialStatus: SyncStatus = { state: 'idle', lastSyncedAt: null, error: null, isFatal: false };

const syncStatusSubject = new BehaviorSubject<SyncStatus>(initialStatus);

export const syncStatus$ = syncStatusSubject.asObservable();

export function getSyncStatus(): SyncStatus {
  return syncStatusSubject.value;
}

export function setSyncStatus(status: SyncStatus): void {
  syncStatusSubject.next(status);
}

export function resetSyncStatus(): void {
  syncStatusSubject.next(initialStatus);
}

