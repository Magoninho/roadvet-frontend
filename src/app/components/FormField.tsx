import React, { ReactNode } from 'react';
import { StyleSheet, StyleProp, Text, View, ViewStyle } from 'react-native';
import { COLORS } from '@/theme';

export type FieldLabelTone = 'default' | 'onBrand';

interface FieldLabelProps {
  label: string;
  /** `onBrand`: white label for fields placed on the brand header. */
  tone?: FieldLabelTone;
  style?: StyleProp<ViewStyle>;
}

/** Title shown above a form field. */
export function FieldLabel({ label, tone = 'default', style }: FieldLabelProps) {
  return (
    <View style={style}>
      <Text style={[styles.label, tone === 'onBrand' && styles.labelOnBrand]}>{label}</Text>
    </View>
  );
}

interface FormFieldProps {
  label: string;
  tone?: FieldLabelTone;
  /** Layout (margins, flex) of the label + field block. */
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/** Wraps any input with a title above it, so the field stays identifiable once filled in. */
export function FormField({ label, tone, style, children }: FormFieldProps) {
  return (
    <View style={style}>
      <FieldLabel label={label} tone={tone} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  labelOnBrand: {
    color: COLORS.onBrand,
  },
});
