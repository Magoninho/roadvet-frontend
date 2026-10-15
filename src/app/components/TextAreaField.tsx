import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface TextAreaFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function TextAreaField({
  value,
  onChangeText,
  placeholder = 'Escrever...',
}: TextAreaFieldProps) {
  return (
    <TextInput
      style={styles.textarea}
      placeholder={placeholder}
      placeholderTextColor={COLORS.placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline
      textAlignVertical="top"
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    padding: 16,
    minHeight: 100,
    fontSize: 14,
    color: COLORS.textDark,
    marginHorizontal: SPACING.gutter,
  },
});