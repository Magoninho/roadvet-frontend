import React from 'react';
import { View, Text, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Tutor from '@/database/models/Tutor';
import { TutorForm } from './TutorForm'; // Importe o componente criado

interface TutorFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (tutor: Tutor) => void;
}

export function TutorFormModal({ visible, onCancel, onSave }: TutorFormModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <KeyboardAvoidingView 
        style={styles.overlay} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cadastrar novo tutor</Text>
          
          {/* Aqui chamamos o formulário reutilizável */}
          <TutorForm 
            onCancel={onCancel} 
            onSave={onSave} 
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    // Limitamos a altura a 85% da tela para sobrar um espaço em cima
    // e permitir que o ScrollView do TutorForm funcione perfeitamente.
    maxHeight: '85%', 
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
});