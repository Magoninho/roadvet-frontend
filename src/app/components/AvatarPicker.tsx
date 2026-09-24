import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DocumentPicker from 'expo-document-picker';
import { persistAttachmentFile } from '@/database/repositories/attachments';
import { convertToDataUri } from '@/utils/image';

interface AvatarPickerProps {
  imageUri?: string | null;
  onSelectImage?: (uri: string) => void;
  onPress?: () => void;
}

export function AvatarPicker({ imageUri, onSelectImage, onPress }: AvatarPickerProps) {
  const handlePress = async () => {
    if (onPress) {
      onPress();
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const savedUri = await persistAttachmentFile(asset.uri, asset.name || 'avatar.jpg');
      const dataUri = await convertToDataUri(savedUri, asset.mimeType);
      if (onSelectImage) {
        onSelectImage(dataUri);
      }
    } catch (error) {
      console.warn('Erro ao selecionar foto do avatar:', error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.circle} onPress={handlePress} activeOpacity={0.8}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Icon name="camera" size={32} color="#5A5A5A" />
        )}
        {imageUri && (
          <View style={styles.badge}>
            <Icon name="camera" size={14} color="#FFFFFF" />
          </View>
        )}
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
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  badge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#2FA9E8',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});