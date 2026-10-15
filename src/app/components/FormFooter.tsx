import React from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface FormFooterProps {
  onCancel: () => void;
  onSave: () => void;
  cancelLabel?: string;
  saveLabel?: string;
  saving?: boolean;
}

export function FormFooter({
  onCancel,
  onSave,
  cancelLabel = 'Cancelar',
  saveLabel = 'Salvar',
  saving = false,
}: FormFooterProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.cancelButton, saving && styles.disabled]}
        onPress={onCancel}
        activeOpacity={0.8}
        disabled={saving}
      >
        <Text style={styles.cancelText}>{cancelLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.disabled]}
        onPress={onSave}
        activeOpacity={0.8}
        disabled={saving}
      >
        {saving ? <ActivityIndicator color={COLORS.onBrand} /> : <Text style={styles.saveText}>{saveLabel}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.gutter,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.bg,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.brand,
    borderRadius: RADIUS.control,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onBrand,
  },
  disabled: {
    opacity: 0.6,
  },
});
