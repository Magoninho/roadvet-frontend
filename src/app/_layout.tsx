import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { database } from '@/database';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useSyncEngine } from '@/database/sync';

function RootNavigator() {
  const { veterinario, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useSyncEngine(veterinario?.id ?? null);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    if (!veterinario && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (veterinario && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [veterinario, isLoading, segments, router]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <DatabaseProvider database={database}>
      <AuthProvider>
        <SafeAreaProvider>
          {/* The app is edge-to-edge on Android, so the provider must not add its own system bar margins. */}
          <KeyboardProvider statusBarTranslucent navigationBarTranslucent preserveEdgeToEdge>
            <RootNavigator />
          </KeyboardProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </DatabaseProvider>
  );
}
