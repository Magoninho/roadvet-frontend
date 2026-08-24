import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import Tutor from '@/database/models/Tutor';
import { BackHeader } from '../../components/BackHeader';
import { TutorForm } from '../../components/TutorForm';

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
    <SafeAreaView style={styles.container}>
      <BackHeader title="Novo Tutor" onBackPress={handleBack} />

      <TutorForm
        onCancel={handleBack}
        onSave={handleSalvar}
      />

    </SafeAreaView>
  );
}

export default NovoTutorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
