import React from 'react';
import { View, TextInput, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '@/theme';

interface WeightInputProps {
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
        placeholderTextColor={COLORS.placeholder}
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    paddingVertical: 14,
  },
  unit: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginLeft: 6,
  },
});