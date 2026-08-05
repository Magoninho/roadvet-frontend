import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PrimaryButtonProps {
  label: string;
  icon?: string;
  onPress: () => void;
}

export function PrimaryButton({ label, icon = 'plus', onPress }: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
      <Icon name={icon} size={18} color="#1A1A1A" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12b4c4',
    borderRadius: 24,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 16,
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});