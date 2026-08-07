import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius } from '@/ui/theme';

export interface PrimaryButtonProps {
  label: string;
  icon?: string;
  onPress: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
}

export function PrimaryButton({
  label,
  icon = 'plus',
  onPress,
  style,
  labelStyle,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      {Boolean(icon) && <Icon name={icon} size={18} color={colors.text.primary} />}
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    marginLeft: spacing.sm,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
