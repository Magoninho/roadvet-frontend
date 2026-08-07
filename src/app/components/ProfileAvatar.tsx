import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProfileAvatarProps {
  photoUrl?: string;
  size?: number;
}

export function ProfileAvatar({ photoUrl, size = 120 }: ProfileAvatarProps) {
  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };

  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={[styles.image, dimensionStyle]} />;
  }

  return (
    <View style={[styles.fallback, dimensionStyle]}>
      <Icon name="account" size={size * 0.5} color="#5A5A5A" />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
  fallback: {
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});