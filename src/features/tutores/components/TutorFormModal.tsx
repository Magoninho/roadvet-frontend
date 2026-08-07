import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../../ui/theme';
import { LabeledInput } from '../../../ui/components';

export interface TutorFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (data: { name: string; phone: string }) => void;
}

export function TutorFormModal({ visible, onCancel, onSave }: TutorFormModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), phone: phone.trim() });
    setName('');
    setPhone('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cadastrar novo tutor</Text>

          <View style={styles.formContent}>
            <LabeledInput
              placeholder="Nome do Tutor"
              value={name}
              onChangeText={setName}
              style={styles.inputSpacing}
            />
            <LabeledInput
              placeholder="Telefone / Celular"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.inputSpacing}
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, !name.trim() && styles.disabled]}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={!name.trim()}
            >
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: borderRadius.lg + 4,
    borderTopRightRadius: borderRadius.lg + 4,
    padding: spacing.xl,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  formContent: {
    marginBottom: spacing.xl,
  },
  inputSpacing: {
    marginBottom: spacing.md,
  },
  modalFooter: {
    flexDirection: 'row',
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
  disabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
