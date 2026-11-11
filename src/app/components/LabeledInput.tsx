import React from 'react';
import { TextInput, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '@/theme';
import { FieldLabelTone, FormField } from './FormField';

interface LabeledInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<TextStyle>;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** Title shown above the field. */
  label?: string;
  /** Layout (margins, flex) of the label + field block; only used together with `label`. */
  containerStyle?: StyleProp<ViewStyle>;
  /** `onBrand`: white label for fields placed on the brand header. */
  labelTone?: FieldLabelTone;
}

export function LabeledInput({
  placeholder,
  value,
  onChangeText,
  style,
  keyboardType = 'default',
  secureTextEntry,
  autoCapitalize,
  label,
  containerStyle,
  labelTone = 'default',
}: LabeledInputProps) {
  const input = (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      accessibilityLabel={label}
    />
  );

  if (!label) return input;

  return (
    <FormField label={label} tone={labelTone} style={containerStyle}>
      {input}
    </FormField>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.textDark,
  },
});