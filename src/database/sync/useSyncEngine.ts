import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { synchronizeDatabase } from './engine';

/**
 * Triggers a sync whenever the app comes to the foreground or connectivity
 * is restored after being offline. Pass `enabled: false` to disable triggers
 * entirely, e.g. while the user isn't logged in.
 */
export function useSyncEngine(enabled: boolean): void {
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    synchronizeDatabase().catch(() => {});

    const appStateSubscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        synchronizeDatabase().catch(() => {});
      }
    });

    const netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      const isOffline = !(state.isConnected && state.isInternetReachable !== false);
      if (wasOfflineRef.current && !isOffline) {
        synchronizeDatabase().catch(() => {});
      }
      wasOfflineRef.current = isOffline;
    });

    return () => {
      appStateSubscription.remove();
      netInfoUnsubscribe();
    };
  }, [enabled]);
}
