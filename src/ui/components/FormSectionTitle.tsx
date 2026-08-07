import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors, spacing } from '@/ui/theme';

export interface FormSectionTitleProps {
  title: string;
  style?: TextStyle;
}

export function FormSectionTitle({ title, style }: FormSectionTitleProps) {
  return <Text style={[styles.title, style]}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    marginHorizontal: spacing.lg,
  },
});
