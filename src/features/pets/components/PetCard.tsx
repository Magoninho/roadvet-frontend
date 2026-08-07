import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius } from '../../../ui/theme';

export interface PetCardData {
  id: string;
  name: string;
  age: string;
  gender: 'Macho' | 'Fêmea';
  breed: string;
  ownerName: string;
  species?: 'dog' | 'cat';
  synced: boolean;
}

interface PetCardProps {
  data: PetCardData;
  onPress?: (id: string) => void;
}

export function PetCard({ data, onPress }: PetCardProps) {
  const { id, name, age, gender, breed, ownerName, species = 'dog' } = data;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(id)}
    >
      <View style={styles.leftContent}>
        <Icon
          name={species === 'cat' ? 'cat' : 'dog'}
          size={18}
          color={colors.text.primary}
          style={styles.petIcon}
        />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.info}>
            {age} | {gender} | {breed}
          </Text>
        </View>
      </View>

      <View style={styles.ownerRow}>
        <Icon name="account" size={16} color="#5A5A5A" />
        <Text style={styles.ownerName}>{ownerName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  petIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  info: {
    fontSize: 12,
    color: '#9A9A9A',
    marginTop: 2,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerName: {
    marginLeft: spacing.xs,
    fontSize: 12,
    color: '#5A5A5A',
  },
});
