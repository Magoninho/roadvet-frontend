import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DocumentPicker from 'expo-document-picker';

export interface AttachmentFile {
  id: string;
  name: string;
  uri: string;
  mimeType?: string;
}

interface FileUploadFieldProps {
  files: AttachmentFile[];
  onFilesChange: (files: AttachmentFile[]) => void;
  label?: string;
}

export function FileUploadField({
  files,
  onFilesChange,
  label = 'Anexar arquivo (PDF ou imagem)',
}: FileUploadFieldProps) {
  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const newFiles: AttachmentFile[] = result.assets.map((asset) => ({
      id: `${Date.now()}-${asset.name}`,
      name: asset.name,
      uri: asset.uri,
      mimeType: asset.mimeType,
    }));

    onFilesChange([...files, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    onFilesChange(files.filter((file) => file.id !== id));
  };

  const getFileIcon = (mimeType?: string) => {
    return mimeType?.startsWith('image/') ? 'file-image-outline' : 'file-pdf-box';
  };

  return (
    <View>
      <TouchableOpacity style={styles.uploadButton} onPress={handlePickFile} activeOpacity={0.8}>
        <Icon name="paperclip" size={18} color="#2FA9E8" />
        <Text style={styles.uploadLabel}>{label}</Text>
      </TouchableOpacity>

      {files.length > 0 && (
        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          style={styles.fileList}
          renderItem={({ item }) => (
            <View style={styles.fileRow}>
              <Icon name={getFileIcon(item.mimeType)} size={18} color="#5A5A5A" />
              <Text style={styles.fileName} numberOfLines={1}>
                {item.name}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveFile(item.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="close" size={16} color="#B0B0B0" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2FA9E8',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
  },
  uploadLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2FA9E8',
  },
  fileList: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  fileName: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 13,
    color: '#1A1A1A',
  },
});