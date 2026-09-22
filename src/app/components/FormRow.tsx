import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface FormRowProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function FormRow({ children, style }: FormRowProps) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    // marginHorizontal: 16,
    marginBottom: 14,
    gap: 12,
  },
});