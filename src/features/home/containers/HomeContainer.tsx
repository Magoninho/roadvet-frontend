import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Header } from '../../../ui/components';
import { colors, spacing, borderRadius } from '../../../ui/theme';

export interface HomeContainerProps {
  userName?: string;
}

export function HomeContainer({ userName = 'Fulano de Tal' }: HomeContainerProps) {
  const router = useRouter();

  const handleNewProntuarioPress = () => {
    router.navigate('/(tabs)/prontuarios/newProntuarioScreen');
  };

  const handleNewTutorPress = () => {
    router.navigate('/(tabs)/tutores');
  };

  const handleNewPetPress = () => {
    router.navigate('/(tabs)/pets/newPetScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Header title="RoadVet" syncStatus="synced" />

        <Text style={styles.greeting}>Olá, {userName}</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={handleNewProntuarioPress}
        >
          <MaterialCommunityIcons name="clipboard-text-outline" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Nova consulta (Prontuário)</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: '#e8a838' }]}
            activeOpacity={0.85}
            onPress={handleNewTutorPress}
          >
            <Ionicons name="person-outline" size={20} color="#fff" />
            <Text style={styles.secondaryButtonText}>Novo Tutor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: '#7ac2a5' }]}
            activeOpacity={0.85}
            onPress={handleNewPetPress}
          >
            <MaterialCommunityIcons name="paw-outline" size={20} color="#fff" />
            <Text style={styles.secondaryButtonText}>Novo Animal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  primaryButton: {
    backgroundColor: '#5b8def',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: spacing.sm,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
