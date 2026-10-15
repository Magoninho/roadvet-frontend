import React from 'react';
import { TextInput, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '@/theme';

interface LabeledInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  keyboardType?: 'default' | 'numeric';
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
      placeholderTextColor={COLORS.placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.textDark,
  },
});