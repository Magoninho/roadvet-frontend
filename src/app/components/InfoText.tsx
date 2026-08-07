import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface InfoTextProps {
  label: string;
  value: string;
}

export function InfoText({ label, value }: InfoTextProps) {
  return (
    <Text style={styles.text}>
      {label}: <Text style={styles.value}>{value}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: '#5A5A5A',
    marginHorizontal: 16,
    marginTop: 4,
  },
  value: {
    color: '#1A1A1A',
  },
});