import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface FormSectionTitleProps {
  text: string;
}

export function FormSectionTitle({ text }: FormSectionTitleProps) {
  return <Text style={styles.title}>{text}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
});