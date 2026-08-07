import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius } from '../../../ui/theme';

export interface OwnerCardData {
  id: string;
  name: string;
  pets: string[];
}

interface OwnerCardProps {
  data: OwnerCardData;
  onPress?: (id: string) => void;
}

export function OwnerCard({ data, onPress }: OwnerCardProps) {
  const { id, name, pets } = data;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(id)}
    >
      <View style={styles.avatarWrapper}>
        <Icon name="account" size={28} color="#5A5A5A" />
      </View>

      <Text style={styles.name}>{name}</Text>

      <View style={styles.petsWrapper}>
        {pets.slice(0, 2).map((pet, index) => (
          <View key={`${id}-pet-${index}`} style={styles.petRow}>
            <Icon name="paw" size={12} color="#8A8A8A" />
            <Text style={styles.petName}>{pet}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '31%',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    marginHorizontal: '1.16%',
    marginBottom: spacing.md,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  petsWrapper: {
    alignSelf: 'stretch',
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  petName: {
    marginLeft: spacing.xs,
    fontSize: 12,
    color: '#8A8A8A',
  },
});
