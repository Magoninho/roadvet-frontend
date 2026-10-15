import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface GhostButtonProps {
  label: string;
  icon?: string;
  onPress: () => void;
}

export function GhostButton({ label, icon = 'plus', onPress }: GhostButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Icon name={icon} size={20} color={COLORS.textDark} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.gutter,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingVertical: 16,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
});