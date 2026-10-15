import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/theme';

interface IconActionButtonProps {
  icon: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

/** Round translucent button for actions placed on the brand header. */
export function IconActionButton({ icon, onPress, accessibilityLabel }: IconActionButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel}
    >
      <Icon name={icon} size={20} color={COLORS.onBrand} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
