import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pet from '@/database/models/Pet';
import { BackHeader } from '../../components/BackHeader';
import { PetForm } from '../../components/PetForm'; // Importa o formulário
import { COLORS } from '@/theme';

export function NovoPetScreen() {
  const router = useRouter();
  const { tutorId } = useLocalSearchParams<{ tutorId?: string }>();

  const handleCancelar = () => {
    router.back();
  };

  const handleSalvar = (pet: Pet) => {
    router.replace({
      pathname: '/(modals)/pets/details',
      params: { petId: pet.id },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <BackHeader title="Novo Pet" onBackPress={handleCancelar} />

      <PetForm
        onCancel={handleCancelar}
        onSave={handleSalvar}
        showTutorSection={!tutorId}
        tutorId={tutorId}
      />
    </SafeAreaView>
  );
}

export default NovoPetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
