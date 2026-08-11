import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '../../components/BackHeader';
import { PetCard, PetCardData } from '../../components/PetCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SearchBar } from '../../components/SearchBar';
import { SectionLabel } from '../../components/SectionLabel';

const MOCK_PETS: PetCardData[] = [
  {
    id: '1',
    name: 'Mingau',
    age: '6 anos',
    gender: 'Macho',
    breed: 'SRD',
    ownerName: 'Fulaninho da Silva',
    species: 'cat',
    synced: true,
  },
  {
    id: '2',
    name: 'Devorador de almas',
    age: '10 anos',
    gender: 'Macho',
    breed: 'Pinscher',
    ownerName: 'Fulaninho da Silva',
    species: 'dog',
    synced: true,
  },
  {
    id: '3',
    name: 'Destruidor de asteróides',
    age: '8 anos',
    gender: 'Macho',
    breed: 'Pitbull',
    ownerName: 'Fulaninho da Silva',
    species: 'dog',
    synced: true,
  },
  {
    id: '4',
    name: 'Amora',
    age: '10 anos',
    gender: 'Fêmea',
    breed: 'Chihuahua',
    ownerName: 'Fulaninho da Silva',
    species: 'dog',
    synced: true,
  },
];

export default function ProntuarioSelection() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleNewPet = () => {
    router.push('/(modals)/pets/new');
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
