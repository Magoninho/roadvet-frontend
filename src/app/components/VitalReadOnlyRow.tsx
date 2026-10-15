import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface VitalItem {
  label: string;
  value: string;
  unit?: string;
}

interface VitalReadOnlyRowProps {
  items: VitalItem[];
}

export function VitalReadOnlyRow({ items }: VitalReadOnlyRowProps) {
  return (
    <View style={styles.row}>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>
            {item.value || '--'}
            {item.unit ? ` ${item.unit}` : ''}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginHorizontal: SPACING.gutter,
    gap: 12,
  },
  item: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
});