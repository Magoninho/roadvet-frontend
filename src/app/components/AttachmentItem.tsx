import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS } from '@/theme';

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
      <Icon name={icon} size={20} color={COLORS.textDark} />
      <Text style={styles.name} numberOfLines={1}>
        {file.name}
      </Text>
      <Icon name="eye-outline" size={18} color={COLORS.brand} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  name: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
    fontSize: 13,
    color: COLORS.textDark,
  },
});