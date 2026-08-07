import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/ui/theme';

export interface TextAreaFieldProps {
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
      placeholderTextColor="#B0B0B0"
      value={value}
      onChangeText={onChangeText}
      multiline
      textAlignVertical="top"
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    padding: 14,
    minHeight: 100,
    fontSize: 14,
    color: colors.text.primary,
    marginHorizontal: spacing.lg,
  },
});
