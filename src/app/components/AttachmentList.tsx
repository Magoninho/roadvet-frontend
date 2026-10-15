import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AttachmentItem, AttachmentFile } from './AttachmentItem';
import { COLORS, SPACING } from '@/theme';

interface AttachmentListProps {
  files: AttachmentFile[];
  onFilePress?: (file: AttachmentFile) => void;
  emptyText?: string;
}

export function AttachmentList({
  files,
  onFilePress,
  emptyText = 'Nenhum arquivo anexado',
}: AttachmentListProps) {
  return (
    <View style={styles.wrapper}>
      {files.length === 0 ? (
        <Text style={styles.emptyText}>{emptyText}</Text>
      ) : (
        files.map((file) => (
          <AttachmentItem key={file.id} file={file} onPress={onFilePress} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: SPACING.gutter,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.placeholder,
    fontStyle: 'italic',
  },
});