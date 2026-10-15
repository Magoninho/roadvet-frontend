import React from 'react';
import { View, Text, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Pet from '@/database/models/Pet';
import { PetForm } from './PetForm';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface PetFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (pet: Pet) => void;
  tutorName?: string; // Opcional: só pra mostrar no título pra quem é o pet
  tutorId?: string; // Obrigatório quando showTutorSection é false
  showTutorSection?: boolean;
}

export function PetFormModal({ visible, onCancel, onSave, tutorName, tutorId, showTutorSection }: PetFormModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Novo pet {tutorName ? `para ${tutorName}` : ''}
          </Text>

          {/* Aqui chamamos o formulário reutilizável SEM a área do tutor */}
          <PetForm
            onCancel={onCancel}
            onSave={onSave}
            showTutorSection={showTutorSection || false}
            tutorId={tutorId}
          />

        </View>
      </KeyboardAvoidingView>
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
    flex: 1,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.sheet,
    borderTopRightRadius: RADIUS.sheet,
    paddingTop: SPACING.section,
    maxHeight: '85%', // Evita que o modal passe da tela
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
    paddingHorizontal: SPACING.gutter,
  },
});