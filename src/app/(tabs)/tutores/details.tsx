import React from 'react';
import { ScrollView, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Header } from '../../components/Header';
import { DetailTopBar } from '../../components/DetailTopBar';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { SectionDivider } from '../../components/SectionDivider';
import { InfoText } from '../../components/InfoText';
import { PrimaryButton } from '../../components/PrimaryButton';
import { PetSummaryCard, PetSummaryData } from '../../components/PetSummaryCard';

const MOCK_TUTOR = {
  id: '1',
  name: 'Magali',
  address: 'Rua do Limoeiro, 67',
  phone: '(85) 9 9574-8673',
  cpf: '713.927.970-55',
  photoUrl: 'https://static.wikia.nocookie.net/monica/images/8/89/Magali_e_Mingau_se_abra%C3%A7ando.png/revision/latest?cb=20221221004720&path-prefix=pt-br'
};

const MOCK_PETS: PetSummaryData[] = [
  { id: '1', name: 'Mingau', age: '6 anos', gender: 'Macho', breed: 'SRD', species: 'cat' },
  { id: '2', name: 'Leo', age: '8 anos', gender: 'Macho', breed: 'SRD', species: 'cat' },
];

export function TutorDetalheScreen() {
  const router = useRouter();
  const { tutorId } = useLocalSearchParams<{ tutorId: string }>();

  const handleBack = () => router.back();
  const handleEdit = () => {
    // navegar para edição do tutor
  };
  const handleDelete = () => {
    // confirmar e excluir tutor
  };
  const handlePetPress = (id: string) => {
    // navegar para detalhe do pet
  };

  const handleNewPet = () => {
    router.push('/global/pets/new');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Tutores" syncStatus="synced" />
      <DetailTopBar onBackPress={handleBack} onEditPress={handleEdit} onDeletePress={handleDelete} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ProfileAvatar photoUrl={MOCK_TUTOR.photoUrl} />
        <Text style={styles.name}>{MOCK_TUTOR.name}</Text>

        <SectionDivider icon="information" label="Informações básicas" />
        <InfoText label="Endereço" value={MOCK_TUTOR.address} />
        <InfoText label="Telefone" value={MOCK_TUTOR.phone} />
        <InfoText label="CPF" value={MOCK_TUTOR.cpf} />

        <SectionDivider icon="paw" label="Pets" />
        <PrimaryButton label="Novo pet" onPress={handleNewPet} />
        {MOCK_PETS.map((pet) => (
          <PetSummaryCard key={pet.id} data={pet} onPress={handlePetPress} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default TutorDetalheScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 14,
  },
});