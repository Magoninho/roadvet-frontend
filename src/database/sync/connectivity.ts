import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { BehaviorSubject } from 'rxjs';

/**
 * Whether a network interface is up at all (Wi-Fi/cellular connected).
 *
 * Deliberately ignores `isInternetReachable`: that flag comes from a
 * best-effort reachability probe that's known to false-negative on some
 * networks/emulators/VPNs even with a perfectly working connection, which
 * used to make the UI claim "Offline" while the user was, in fact, online
 * (their sync requests were just failing for some other reason, e.g. no API
 * server reachable). A failing sync is instead surfaced as the "syncing"
 * state (see useConnectionIndicator), which keeps retrying instead of
 * telling the user they're offline when they aren't.
 */
function computeIsOnline(state: NetInfoState): boolean {
  return !!state.isConnected;
}

const isOnlineSubject = new BehaviorSubject<boolean>(true);

export const isOnline$ = isOnlineSubject.asObservable();

export function getIsOnline(): boolean {
  return isOnlineSubject.value;
}

// Module-level singleton: one NetInfo listener for the whole app, shared by
// useSyncEngine (to know when to trigger a reconnect sync) and the UI's
// connection indicator.
NetInfo.addEventListener((state) => {
  isOnlineSubject.next(computeIsOnline(state));
});
NetInfo.fetch().then((state) => {
  isOnlineSubject.next(computeIsOnline(state));
});
