import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface GhostButtonProps {
  label: string;
  icon?: string;
  onPress: () => void;
}

export function GhostButton({ label, icon = 'plus', onPress }: GhostButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Icon name={icon} size={16} color="#2FA9E8" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2FA9E8',
    borderRadius: 24,
    paddingVertical: 12,
  },
  label: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#2FA9E8',
  },
});