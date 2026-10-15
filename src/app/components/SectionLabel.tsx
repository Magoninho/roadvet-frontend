import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/theme';

interface SectionLabelProps {
  text: string;
}

export function SectionLabel({ text }: SectionLabelProps) {
  return <Text style={styles.label}>{text}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginHorizontal: SPACING.gutter,
    marginTop: SPACING.section,
    marginBottom: 4,
  },
});
