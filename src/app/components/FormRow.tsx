import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface FormRowProps {
  children: ReactNode;
}

export function FormRow({ children }: FormRowProps) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    // marginHorizontal: 16,
    marginBottom: 14,
    gap: 12,
  },
});