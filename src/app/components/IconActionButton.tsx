import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconActionButtonProps {
  icon: string;
  color: string;
  onPress: () => void;
}

export function IconActionButton({ icon, color, onPress }: IconActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon name={icon} size={16} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});