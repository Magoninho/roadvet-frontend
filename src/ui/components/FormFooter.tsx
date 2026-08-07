import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/ui/theme';

export interface FormFooterProps {
  onCancel: () => void;
  onSave: () => void;
  cancelLabel?: string;
  saveLabel?: string;
  saveDisabled?: boolean;
}

export function FormFooter({
  onCancel,
  onSave,
  cancelLabel = 'Cancelar',
  saveLabel = 'Salvar',
  saveDisabled = false,
}: FormFooterProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
        <Text style={styles.cancelText}>{cancelLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton, saveDisabled && styles.saveDisabled]}
        onPress={onSave}
        activeOpacity={0.8}
        disabled={saveDisabled}
      >
        <Text style={styles.saveText}>{saveLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.text.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
