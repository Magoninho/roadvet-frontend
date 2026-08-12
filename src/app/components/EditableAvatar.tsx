import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProfileAvatar } from './ProfileAvatar';

interface EditableAvatarProps {
  photoUrl?: string;
  size?: number;
  fallbackIcon?: string;
  editable?: boolean;
  onPress?: () => void;
}

export function EditableAvatar({
  photoUrl,
  size = 120,
  fallbackIcon = 'account',
  editable = false,
  onPress,
}: EditableAvatarProps) {
  return (
    <View style={styles.wrapper}>
      <ProfileAvatar photoUrl={photoUrl} size={size} fallbackIcon={fallbackIcon} />

      {editable && (
        <TouchableOpacity style={styles.editBadge} onPress={onPress} activeOpacity={0.8}>
          <Icon name="camera" size={16} color="#FFFFFF" />
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
    backgroundColor: '#2FA9E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});