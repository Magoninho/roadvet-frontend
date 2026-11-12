import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  // On Android the modal draws behind the navigation bar, so the bottom inset keeps the footer clear of it.
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior="padding"
        automaticOffset
        // The keyboard already covers the inset area, so it is discounted while the keyboard is open.
        keyboardVerticalOffset={-insets.bottom}
      >
        <View style={[styles.modalContent, { paddingBottom: insets.bottom }]}>
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