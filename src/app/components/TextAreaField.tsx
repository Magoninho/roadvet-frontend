import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

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
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    fontSize: 14,
    color: '#1A1A1A',
    marginHorizontal: 16,
  },
});