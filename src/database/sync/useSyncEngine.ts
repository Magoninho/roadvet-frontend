import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { getIsOnline, isOnline$ } from './connectivity';
import { synchronizeDatabase } from './engine';
import { syncStatus$ } from './status';
import { uploadPendingAttachments } from './attachmentUpload';
import { uploadPendingAvatars } from './avatarUpload';

const RETRY_INTERVAL_MS = 10000;

function runSyncCycle(veterinarioId: string) {
  synchronizeDatabase()
    .then(() => Promise.all([uploadPendingAttachments(veterinarioId), uploadPendingAvatars(veterinarioId)]))
    .catch(() => {});
}

/**
 * Triggers a sync whenever the app comes to the foreground, connectivity is
 * restored after being offline, or (while online) the previous sync attempt
 * failed — e.g. the API is unreachable even though the device has a network
 * connection. That last case keeps retrying on an interval instead of
 * leaving the user stuck on a failed sync until the next foreground/reconnect
 * event. Pass `veterinarioId: null` to disable entirely, e.g. while no one
 * is logged in.
 */
export function useSyncEngine(veterinarioId: string | null): void {
  const wasOfflineRef = useRef(!getIsOnline());

  useEffect(() => {
    if (!veterinarioId) return;

    runSyncCycle(veterinarioId);

    const appStateSubscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        runSyncCycle(veterinarioId);
      }
    });

    const connectivitySubscription = isOnline$.subscribe((online) => {
      if (wasOfflineRef.current && online) {
        runSyncCycle(veterinarioId);
      }
      wasOfflineRef.current = !online;
    });

    let retryTimer: ReturnType<typeof setInterval> | null = null;
    const statusSubscription = syncStatus$.subscribe(({ state }) => {
      if (state === 'error' && getIsOnline()) {
        if (!retryTimer) {
          retryTimer = setInterval(() => runSyncCycle(veterinarioId), RETRY_INTERVAL_MS);
        }
      } else if (retryTimer) {
        clearInterval(retryTimer);
        retryTimer = null;
      }
    });

    return () => {
      appStateSubscription.remove();
      connectivitySubscription.unsubscribe();
      statusSubscription.unsubscribe();
      if (retryTimer) clearInterval(retryTimer);
    };
  }, [veterinarioId]);
}
