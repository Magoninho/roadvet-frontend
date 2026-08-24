import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pet from '@/database/models/Pet';
import Tutor from '@/database/models/Tutor';
import { observeAllPets } from '@/database/repositories/pets';
import { useObservable } from '@/database/hooks/useObservable';
import { formatAge, speciesToIcon } from '@/utils/format';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import { PetCard, PetCardData } from '../../components/PetCard';
import { SearchBar } from '../../components/SearchBar';
import { ViewSortFilterBar } from '../../components/ViewSortFilterBar';

function PetCardContainer({ pet, onPress }: { pet: Pet; onPress: (id: string) => void }) {
  const tutor = useObservable<Tutor | null>(() => pet.tutor.observe(), [pet.id], null);

  const data: PetCardData = {
    id: pet.id,
    name: pet.nome,
    age: formatAge(pet.dataNascimento),
    breed: pet.raca,
    ownerName: tutor?.nomeCompleto ?? '',
    species: speciesToIcon(pet.especie),
    synced: true,
    photoUrl: pet.avatarUrl ?? undefined,
  };

  return <PetCard data={data} onPress={onPress} />;
}

export default function PetsScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const pets = useObservable(() => observeAllPets(), [], []);
  const filteredPets = search.trim()
    ? pets.filter((pet) => pet.nome.toLowerCase().includes(search.trim().toLowerCase()))
    : pets;

  const handleView = () => {
    // alternar entre lista/grade
  };

  const handleSort = () => {
    // abrir modal de ordenação
  };

  const handleFilter = () => {
    // abrir modal de filtro
  };

  const handleCardPress = (id: string) => {
    router.push({
      params: { petId: id },
      pathname: '/(modals)/pets/details'
    });
  };

  const handleAddPress = () => {
    router.navigate('/(modals)/pets/new');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Pets" syncStatus="synced" />
      <SearchBar value={search} onChangeText={setSearch} />
      <ViewSortFilterBar
        onViewPress={handleView}
        onSortPress={handleSort}
        onFilterPress={handleFilter}
      />

      <FlatList
        data={filteredPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCardContainer pet={item} onPress={handleCardPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <FloatingActionButton onPress={handleAddPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  listContent: {
    paddingBottom: 100,
  },
});
