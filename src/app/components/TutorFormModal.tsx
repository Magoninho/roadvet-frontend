import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Tutor from '@/database/models/Tutor';
import { TutorForm } from './TutorForm'; // Importe o componente criado
import { COLORS, RADIUS, SPACING } from '@/theme';

interface TutorFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (tutor: Tutor) => void;
}

export function TutorFormModal({ visible, onCancel, onSave }: TutorFormModalProps) {
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
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.sheet,
    borderTopRightRadius: RADIUS.sheet,
    paddingTop: SPACING.section,
    // Limitamos a altura a 85% da tela para sobrar um espaço em cima
    // e permitir que o ScrollView do TutorForm funcione perfeitamente.
    maxHeight: '85%', 
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
    paddingHorizontal: SPACING.gutter,
  },
});