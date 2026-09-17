import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import { observePetRows, PetRow } from '@/database/repositories/lists';
import { useObservable } from '@/database/hooks/useObservable';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useAuth } from '@/contexts/AuthContext';
import { formatAge, speciesToIcon } from '@/utils/format';
import { EmptyListMessage } from '../../components/EmptyListMessage';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import { PetCard, PetCardData } from '../../components/PetCard';
import { SearchBar } from '../../components/SearchBar';
import { ViewSortFilterBar } from '../../components/ViewSortFilterBar';

function toPetCardData({ pet, tutor }: PetRow): PetCardData {
  return {
    id: pet.id,
    name: pet.nome,
    age: formatAge(pet.dataNascimento),
    breed: pet.raca,
    ownerName: tutor?.nomeCompleto ?? '',
    species: speciesToIcon(pet.especie),
    synced: true,
    photoUrl: pet.avatarUrl ?? undefined,
  };
}

export default function PetsScreen() {
  const { veterinario } = useAuth();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const petRows = useObservable<PetRow[]>(
    () => (veterinario ? observePetRows(veterinario.id) : of([])),
    [veterinario],
    [],
  );
  const visibleRows = useSearchFilter(petRows, search);

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
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Pesquisar por pet, raça ou tutor..."
      />
      <ViewSortFilterBar
        onViewPress={handleView}
        onSortPress={handleSort}
        onFilterPress={handleFilter}
      />

      <FlatList
        data={visibleRows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard data={toPetCardData(item)} onPress={handleCardPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          search.trim() ? (
            <EmptyListMessage
              title={`Nenhum pet encontrado para "${search.trim()}"`}
              subtitle="Pesquise pelo nome do pet, raça, espécie ou pelo tutor."
            />
          ) : (
            <EmptyListMessage
              icon="paw"
              title="Nenhum pet cadastrado"
              subtitle="Toque no botão + para cadastrar o primeiro pet."
            />
          )
        }
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
