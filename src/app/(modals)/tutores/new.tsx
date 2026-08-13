import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { BackHeader } from '../../components/BackHeader';
import { TutorForm } from '../../components/TutorForm'; // Importe o formulário

export function NovoTutorScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSalvar = (nomeCompleto: string) => {
    // Como a tela tem foco próprio, ao salvar, você pode voltar para a tela anterior
    // ou ir para um tela de sucesso.
    console.log('Tutor salvo pela tela inteira:', nomeCompleto);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Novo Tutor" onBackPress={handleBack} />

      {/* Reutilizando a mesma lógica! */}
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