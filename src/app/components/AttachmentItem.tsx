import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface AttachmentFile {
  id: string;
  name: string;
  uri: string;
  mimeType?: string;
}

interface AttachmentItemProps {
  file: AttachmentFile;
  onPress?: (file: AttachmentFile) => void;
}

export function AttachmentItem({ file, onPress }: AttachmentItemProps) {
  const icon = file.mimeType?.startsWith('image/') ? 'file-image-outline' : 'file-pdf-box';

  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress?.(file)} activeOpacity={0.8}>
      <Icon name={icon} size={20} color="#5A5A5A" />
      <Text style={styles.name} numberOfLines={1}>
        {file.name}
      </Text>
      <Icon name="eye-outline" size={18} color="#2FA9E8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  name: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 13,
    color: '#1A1A1A',
  },
});