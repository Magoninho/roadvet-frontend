import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface SectionLabelProps {
  text: string;
}

export function SectionLabel({ text }: SectionLabelProps) {
  return <Text style={styles.label}>{text}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: '#9A9A9A',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 4,
  },
});
