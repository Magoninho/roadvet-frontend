import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '../../components/BackHeader';
import { PetCard, PetCardData } from '../../components/PetCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SearchBar } from '../../components/SearchBar';
import { SectionLabel } from '../../components/SectionLabel';
import { PetFormModal } from '@/app/components/PetFormModal';

const MOCK_PETS: PetCardData[] = [
  {
    id: '1',
    name: 'Mingau',
    age: '6 anos',
    gender: 'Macho',
    breed: 'Angorá',
    ownerName: 'Magali',
    species: 'cat',
    synced: true,
    photoUrl: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fmonica%2Fimages%2F5%2F5a%2FMingau_%2528foto_promocional%2529.jpg%2Frevision%2Flatest%3Fcb%3D20180728012816%26path-prefix%3Dpt-br&cx=400'
  },
  {
    id: '2',
    name: 'Floquinho',
    age: '10 anos',
    gender: 'Macho',
    breed: 'Lhasa Apso',
    ownerName: 'Cebolinha',
    species: 'dog',
    synced: true,
    photoUrl: 'https://static.wikia.nocookie.net/monica/images/b/b8/Floquinho_em_fundo_branco.png/revision/latest?cb=20250421203021&path-prefix=pt-br'
  },
  {
    id: '3',
    name: 'Bidu',
    age: '6 anos',
    gender: 'Macho',
    breed: 'Schnauzer',
    ownerName: 'Franjinha',
    species: 'cat',
    synced: true,
    photoUrl: 'https://static.wikia.nocookie.net/monica/images/5/59/Bidu_transparente.png/revision/latest?cb=20231022195750&path-prefix=pt-br'
  },
  {
    id: '4',
    name: 'Monicão',
    age: '4 anos',
    gender: 'Macho',
    breed: 'SRD',
    ownerName: 'Mônica',
    species: 'dog',
    synced: true,
    photoUrl: 'https://static.wikia.nocookie.net/monica/images/6/61/Monic%C3%A3o_em_fundo_branco.png/revision/latest/scale-to-width-down/1000?cb=20250421150545&path-prefix=pt-br'
  },
];

export default function ProntuarioSelection() {
  const [search, setSearch] = useState('');
  const [modalPetVisible, setModalPetVisible] = useState(false);

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleNewPet = () => {
    setModalPetVisible(true);
  };

  const handleSaveNewPet = (petData: any) => {
    // Aqui você junta os dados do formulário de pet com o ID do Tutor (tutorId)
    // console.log("Salvando pet para tutor:", tutorId, petData);
    
    // Esconde o modal após salvar
    setModalPetVisible(false);
  };

  const handleSelectPet = (id: string) => {
    router.push({
      pathname: '/(modals)/prontuarios/new',
      params: { petId: id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Criar prontuário" onBackPress={handleBack} />
      <SearchBar value={search} onChangeText={setSearch} />
      <PrimaryButton label="Novo pet" onPress={handleNewPet} />
      <SectionLabel text="Pets cadastrados" />

      <FlatList
        data={MOCK_PETS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard data={item} onPress={handleSelectPet} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <PetFormModal
        visible={modalPetVisible}
        onCancel={() => setModalPetVisible(false)}
        onSave={handleSaveNewPet}
        showTutorSection={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 40,
  },
});
