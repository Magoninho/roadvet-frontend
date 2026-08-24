import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { database } from '@/database';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function RootNavigator() {
  const { veterinario, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

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
          <RootNavigator />
        </SafeAreaProvider>
      </AuthProvider>
    </DatabaseProvider>
  );
}
