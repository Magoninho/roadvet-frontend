import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: '#9A9A9A',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});