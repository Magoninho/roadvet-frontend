import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

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
    marginHorizontal: 16,
    marginTop: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
  unit: {
    marginLeft: 10,
    fontSize: 14,
    color: '#5A5A5A',
    minWidth: 24,
  },
});