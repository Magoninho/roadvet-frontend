import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface VitalInputFieldProps {
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
        placeholderTextColor={COLORS.placeholder}
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
    marginHorizontal: SPACING.gutter,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.textDark,
  },
  unit: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textMuted,
    minWidth: 24,
  },
});