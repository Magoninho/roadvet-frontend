import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/theme';

interface FormSectionTitleProps {
  text: string;
}

export function FormSectionTitle({ text }: FormSectionTitleProps) {
  return <Text style={styles.title}>{text}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginHorizontal: SPACING.gutter,
    marginTop: SPACING.block,
    marginBottom: 12,
  },
});