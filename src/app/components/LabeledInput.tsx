import React from 'react';
import { TextInput, StyleSheet, StyleProp, ViewStyle } from 'react-native';

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
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
});