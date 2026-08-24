import { useObservable } from '@/database/hooks/useObservable';
import { getSyncStatus, syncStatus$, type SyncStatus } from './status';

export function useSyncStatus(): SyncStatus {
  return useObservable(() => syncStatus$, [], getSyncStatus());
}
