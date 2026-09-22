import { combineLatest, map } from 'rxjs';
import { useObservable } from '@/database/hooks/useObservable';
import { getIsOnline, isOnline$ } from './connectivity';
import { getSyncStatus, syncStatus$, type SyncState } from './status';

export type ConnectionIndicatorStatus = 'online' | 'syncing' | 'offline';

/**
 * `error` (e.g. the API is unreachable) is deliberately shown as `syncing`,
 * not `online` or `offline`: the device does have a network connection, so
 * "offline" would be wrong, but the last sync didn't actually succeed, so
 * claiming "online" would be misleading too. `syncing` keeps the engine
 * retrying (see useSyncEngine) until it either succeeds or the connection
 * really does drop.
 */
function deriveStatus(online: boolean, syncState: SyncState): ConnectionIndicatorStatus {
  if (!online) return 'offline';
  if (syncState === 'syncing' || syncState === 'error') return 'syncing';
  return 'online';
}

const connectionIndicator$ = combineLatest([isOnline$, syncStatus$]).pipe(
  map(([online, sync]) => deriveStatus(online, sync.state)),
);

/** Drives the header's online/syncing/offline indicator from real connectivity + sync state. */
export function useConnectionIndicator(): ConnectionIndicatorStatus {
  return useObservable(
    () => connectionIndicator$,
    [],
    deriveStatus(getIsOnline(), getSyncStatus().state),
  );
}
