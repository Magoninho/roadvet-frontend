import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FormFooterProps {
  onCancel: () => void;
  onSave: () => void;
  cancelLabel?: string;
  saveLabel?: string;
}

export function FormFooter({
  onCancel,
  onSave,
  cancelLabel = 'Cancelar',
  saveLabel = 'Salvar',
}: FormFooterProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
        <Text style={styles.cancelText}>{cancelLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={onSave} activeOpacity={0.8}>
        <Text style={styles.saveText}>{saveLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#0FB5C8',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});