import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { getIsOnline, isOnline$ } from './connectivity';
import { synchronizeDatabase } from './engine';
import { getSyncStatus, syncStatus$ } from './status';
import { uploadPendingAttachments } from './attachmentUpload';
import { uploadPendingAvatars } from './avatarUpload';

const RETRY_INTERVAL_MS = 10000;
const HEALTHY_SYNC_INTERVAL_MS = 15000;

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
 * event. While healthy, it also re-syncs periodically so the API going down
 * is noticed without waiting for one of those events. Pass
 * `veterinarioId: null` to disable entirely, e.g. while no one is logged in.
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
    const statusSubscription = syncStatus$.subscribe(({ state, isFatal, error }) => {
      if (state === 'error' && getIsOnline()) {
        if (isFatal) {
          // Permanent or client validation error (e.g. 400 Bad Request, 401 Unauthorized, 403 Forbidden).
          // Stop retrying automatically to avoid hammering the backend in an endless loop.
          if (retryTimer) {
            clearInterval(retryTimer);
            retryTimer = null;
          }
          console.warn('[useSyncEngine] Sincronização falhou com erro permanente/autorização; loop automático interrompido:', error);
          return;
        }

        if (!retryTimer) {
          retryTimer = setInterval(() => runSyncCycle(veterinarioId), RETRY_INTERVAL_MS);
        }
      } else if (retryTimer) {
        clearInterval(retryTimer);
        retryTimer = null;
      }
    });

    // Once a sync succeeds, none of the triggers above fire again while the app stays in the
    // foreground, so the API going down afterwards went unnoticed and the header kept claiming
    // "Online". A periodic cycle while healthy surfaces that as `error` (shown as "Sincronizando...")
    // and hands over to the retry timer above; it also pushes local edits made since the last sync.
    const healthTimer = setInterval(() => {
      const current = getSyncStatus();
      if (
        AppState.currentState === 'active' &&
        getIsOnline() &&
        current.state !== 'error' &&
        !current.isFatal
      ) {
        runSyncCycle(veterinarioId);
      }
    }, HEALTHY_SYNC_INTERVAL_MS);

    return () => {
      appStateSubscription.remove();
      connectivitySubscription.unsubscribe();
      statusSubscription.unsubscribe();
      if (retryTimer) clearInterval(retryTimer);
      clearInterval(healthTimer);
    };
  }, [veterinarioId]);
}
