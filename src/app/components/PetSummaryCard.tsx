import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING } from '@/theme';

export interface PetSummaryData {
  id: string;
  name: string;
  age: string;
  breed?: string | null;
  species?: 'dog' | 'cat';
}

interface PetSummaryCardProps {
  data: PetSummaryData;
  onPress?: (id: string) => void;
}

export function PetSummaryCard({ data, onPress }: PetSummaryCardProps) {
  const { id, name, age, breed, species = 'cat' } = data;
  const info = [age, breed].filter(Boolean).join(' | ');

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(id)}
    >
      <View style={styles.leftContent}>
        <Icon name={species === 'dog' ? 'dog' : 'cat'} size={20} color={COLORS.brand} style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
      </View>

      <Text style={styles.info}>{info}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: SPACING.gutter,
    marginTop: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  info: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});