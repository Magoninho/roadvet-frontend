import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors, spacing } from '@/ui/theme';

export interface SectionLabelProps {
  label: string;
  style?: TextStyle;
}

export function SectionLabel({ label, style }: SectionLabelProps) {
  return <Text style={[styles.label, style]}>{label}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
});
