import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AttachmentItem, AttachmentFile } from './AttachmentItem';

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
    marginHorizontal: 16,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#B0B0B0',
    fontStyle: 'italic',
  },
});