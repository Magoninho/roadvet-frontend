import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface TutorFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (nomeTutor: string) => void;
}

function FormularioTutor({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (nomeTutor: string) => void;
}) {
  const handleSalvar = () => {
    // TODO: substituir por formulário real de cadastro de tutor
    onSave('Novo Tutor Cadastrado');
  };

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Cadastrar novo tutor</Text>

      <View style={styles.placeholderBox}>
        <Text style={styles.placeholderText}>TODO: Formulário de Tutor</Text>
      </View>

      <View style={styles.modalFooter}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar} activeOpacity={0.8}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function TutorFormModal({ visible, onCancel, onSave }: TutorFormModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <FormularioTutor onCancel={onCancel} onSave={onSave} />
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  placeholderBox: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9A9A9A',
  },
  modalFooter: {
    flexDirection: 'row',
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