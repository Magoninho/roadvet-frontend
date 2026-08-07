import React from 'react';
import { TextInput, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { colors, borderRadius } from '@/ui/theme';

export interface LabeledInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<TextStyle>;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

export function LabeledInput({
  placeholder,
  value,
  onChangeText,
  style,
  keyboardType = 'default',
}: LabeledInputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor="#B0B0B0"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md - 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text.primary,
  },
});
