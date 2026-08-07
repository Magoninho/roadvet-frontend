import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/ui/theme';

export interface VitalInputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  unit?: string;
  keyboardType?: 'default' | 'numeric';
}

export function VitalInputField({
  placeholder,
  value,
  onChangeText,
  unit,
  keyboardType = 'default',
}: VitalInputFieldProps) {
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#B0B0B0"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
      {unit && <Text style={styles.unit}>{unit}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md - 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text.primary,
  },
  unit: {
    marginLeft: 10,
    fontSize: 14,
    color: '#5A5A5A',
    minWidth: 24,
  },
});
