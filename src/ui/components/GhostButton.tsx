import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius } from '@/ui/theme';

export interface GhostButtonProps {
  label: string;
  icon?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function GhostButton({ label, icon = 'plus', onPress, style }: GhostButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
      {Boolean(icon) && <Icon name={icon} size={16} color={colors.primary} />}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
  },
  label: {
    marginLeft: spacing.xs + 2,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
