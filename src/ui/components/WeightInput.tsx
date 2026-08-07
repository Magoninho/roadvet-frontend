import React from 'react';
import { View, TextInput, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, borderRadius } from '@/ui/theme';

export interface WeightInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export function WeightInput({ value, onChangeText, placeholder = 'Peso', style }: WeightInputProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#B0B0B0"
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
      />
      <Text style={styles.unit}>kg</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md - 2,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 12,
  },
  unit: {
    fontSize: 14,
    color: '#5A5A5A',
    marginLeft: 6,
  },
});
