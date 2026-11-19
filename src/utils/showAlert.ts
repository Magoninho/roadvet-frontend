import { Alert, Platform } from 'react-native';

/**
 * Cross-platform informational alert. react-native-web ships `Alert.alert` as a no-op,
 * so on the web build validation and error messages built on it were silently dropped,
 * making Save buttons look dead. For confirmations with actions, use `ConfirmDialog`.
 */
export function showAlert(title: string, message?: string): void {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}
