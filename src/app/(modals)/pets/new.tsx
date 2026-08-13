import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '../../components/BackHeader';
import { PetForm } from '../../components/PetForm'; // Importa o formulário

export function NovoPetScreen() {
  const router = useRouter();

  const handleCancelar = () => {
    router.back();
  };

  const handleSalvar = (petData: any) => {
    console.log('Pet salvo com tutor selecionado:', petData);
    // Lógica para chamar API...
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Novo Pet" onBackPress={handleCancelar} />

      <PetForm 
        onCancel={handleCancelar} 
        onSave={handleSalvar} 
        showTutorSection={true} 
      />
    </SafeAreaView>
  );
}

export default NovoPetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});