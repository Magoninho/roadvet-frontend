import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/theme';

interface InfoTextProps {
  label: string;
  value: string;
}

export function InfoText({ label, value }: InfoTextProps) {
  return (
    <Text style={styles.text}>
      {label}: <Text style={styles.value}>{value}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.gutter,
    marginTop: 8,
    lineHeight: 20,
  },
  value: {
    fontWeight: '600',
    color: COLORS.textDark,
  },
});