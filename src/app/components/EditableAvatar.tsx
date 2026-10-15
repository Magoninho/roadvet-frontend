import React from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/theme';
import { AvatarTone, ProfileAvatar } from './ProfileAvatar';

interface EditableAvatarProps {
  photoUrl?: string;
  size?: number;
  fallbackIcon?: string;
  editable?: boolean;
  onPress?: () => void;
  tone?: AvatarTone;
  style?: StyleProp<ViewStyle>;
}

export function EditableAvatar({
  photoUrl,
  size = 120,
  fallbackIcon = 'account',
  editable = false,
  onPress,
  tone = 'default',
  style,
}: EditableAvatarProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <ProfileAvatar photoUrl={photoUrl} size={size} fallbackIcon={fallbackIcon} tone={tone} />

      {editable && (
        <TouchableOpacity
          style={[styles.editBadge, tone === 'onBrand' ? styles.editBadgeOnBrand : styles.editBadgeDefault]}
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityLabel="Alterar foto"
        >
          <Icon name="camera" size={16} color={tone === 'onBrand' ? COLORS.brand : COLORS.onBrand} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  editBadgeDefault: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.bg,
  },
  editBadgeOnBrand: {
    backgroundColor: COLORS.onBrand,
    borderColor: COLORS.brand,
  },
});
