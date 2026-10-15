import React from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  /** Consequences listed under a warning, e.g. the records a deletion also removes. */
  warnings?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Cross-platform replacement for `Alert.alert` confirmations: react-native-web ships `Alert.alert`
 * as a no-op, so a confirmation built on it never shows up (nor runs its action) on the web build.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  warnings = [],
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  loading = false,
  error = null,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    if (!loading) onCancel();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleCancel}>
      <Pressable style={styles.overlay} onPress={handleCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.iconCircle}>
            <Icon name="trash-can-outline" size={26} color={COLORS.danger} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {warnings.length > 0 && (
            <View style={styles.warningBox}>
              {warnings.map((warning) => (
                <View key={warning} style={styles.warningRow}>
                  <Icon name="alert-circle-outline" size={16} color="#C0392B" style={styles.warningIcon} />
                  <Text style={styles.warningText}>{warning}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.irreversible}>Esta ação não pode ser desfeita.</Text>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelButton, loading && styles.disabled]}
              onPress={handleCancel}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.disabled]}
              onPress={onConfirm}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={COLORS.onBrand} /> : <Text style={styles.confirmText}>{confirmLabel}</Text>}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.sheet,
    padding: SPACING.section,
    alignItems: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  warningBox: {
    alignSelf: 'stretch',
    marginTop: 16,
    padding: 12,
    borderRadius: RADIUS.control,
    backgroundColor: COLORS.dangerSoft,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#8E2B21',
    marginBottom: 4,
  },
  irreversible: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  error: {
    marginTop: 8,
    fontSize: 13,
    color: '#C0392B',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 20,
    gap: 12,
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
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.control,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onBrand,
  },
  disabled: {
    opacity: 0.6,
  },
});
