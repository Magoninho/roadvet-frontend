import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { synchronizeDatabase } from './engine';
import { uploadPendingAttachments } from './attachmentUpload';

function runSyncCycle(veterinarioId: string) {
  synchronizeDatabase()
    .then(() => uploadPendingAttachments(veterinarioId))
    .catch(() => {});
}

/**
 * Triggers a sync whenever the app comes to the foreground or connectivity
 * is restored after being offline, followed by uploading any pending
 * attachment files. Pass `veterinarioId: null` to disable entirely, e.g.
 * while no one is logged in.
 */
export function useSyncEngine(veterinarioId: string | null): void {
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!veterinarioId) return;

    runSyncCycle(veterinarioId);

    const appStateSubscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        runSyncCycle(veterinarioId);
      }
    });

    const netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      const isOffline = !(state.isConnected && state.isInternetReachable !== false);
      if (wasOfflineRef.current && !isOffline) {
        runSyncCycle(veterinarioId);
      }
      wasOfflineRef.current = isOffline;
    });

    return () => {
      appStateSubscription.remove();
      netInfoUnsubscribe();
    };
  }, [veterinarioId]);
}
