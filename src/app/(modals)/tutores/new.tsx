import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useRouter } from 'expo-router';
import Tutor from '@/database/models/Tutor';
import { BackHeader } from '../../components/BackHeader';
import { TutorForm } from '../../components/TutorForm';
import { COLORS } from '@/theme';

export function NovoTutorScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSalvar = (tutor: Tutor) => {
    router.replace({
      pathname: '/(modals)/tutores/details',
      params: { id: tutor.id },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <BackHeader title="Novo Tutor" onBackPress={handleBack} />

      <KeyboardAvoidingView style={styles.flex} behavior="padding" automaticOffset>
        <TutorForm onCancel={handleBack} onSave={handleSalvar} />
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

export default NovoTutorScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
