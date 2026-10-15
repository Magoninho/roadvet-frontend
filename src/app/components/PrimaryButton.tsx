import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface PrimaryButtonProps {
  label: string;
  icon?: string;
  onPress: () => void;
}

export function PrimaryButton({ label, icon = 'plus', onPress }: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
      <Icon name={icon} size={20} color={COLORS.onBrand} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brand,
    borderRadius: RADIUS.control,
    paddingVertical: 16,
    marginHorizontal: SPACING.gutter,
    marginTop: SPACING.section,
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onBrand,
  },
});