import React from 'react';
import { View, Text, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { PetForm } from './PetForm';

interface PetFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (petData: any) => void;
  tutorName?: string; // Opcional: só pra mostrar no título pra quem é o pet
}

export function PetFormModal({ visible, onCancel, onSave, tutorName }: PetFormModalProps) {
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
            showTutorSection={false} 
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '85%', // Evita que o modal passe da tela
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
});