import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AvatarPickerProps {
  onPress?: () => void;
}

export function AvatarPicker({ onPress }: AvatarPickerProps) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.circle} onPress={onPress} activeOpacity={0.8}>
        <Icon name="camera" size={32} color="#5A5A5A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});