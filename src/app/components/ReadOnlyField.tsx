import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface ReadOnlyFieldProps {
  value: string;
  emptyText?: string;
}

export function ReadOnlyField({ value, emptyText = 'Não informado' }: ReadOnlyFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={value ? styles.text : styles.emptyText}>
        {value || emptyText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: SPACING.gutter,
  },
  text: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.placeholder,
    fontStyle: 'italic',
  },
});