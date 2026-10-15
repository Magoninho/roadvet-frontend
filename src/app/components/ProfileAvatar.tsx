import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/theme';

export type AvatarTone = 'default' | 'onBrand';

interface ProfileAvatarProps {
  photoUrl?: string;
  size?: number;
  fallbackIcon?: string;
  /** `onBrand`: translucent white fallback for avatars placed on the brand header. */
  tone?: AvatarTone;
}

export function ProfileAvatar({ photoUrl, size = 120, fallbackIcon = 'account', tone = 'default' }: ProfileAvatarProps) {
  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };

  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={[styles.image, dimensionStyle]} />;
  }

  const onBrand = tone === 'onBrand';

  return (
    <View style={[styles.fallback, onBrand ? styles.fallbackOnBrand : styles.fallbackDefault, dimensionStyle]}>
      <Icon name={fallbackIcon} size={size * 0.5} color={onBrand ? COLORS.onBrand : COLORS.textDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
  fallback: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackDefault: {
    backgroundColor: COLORS.surface,
  },
  fallbackOnBrand: {
    backgroundColor: COLORS.brandOverlay,
  },
});
