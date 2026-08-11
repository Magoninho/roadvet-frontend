import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ReadOnlyFieldProps {
  value: string;
  emptyText?: string;
}

export function ReadOnlyField({ value, emptyText = 'Não informado' }: ReadOnlyFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={value ? styles.text : styles.emptyText}>
        {value || emptyText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
  },
  text: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#B0B0B0',
    fontStyle: 'italic',
  },
});