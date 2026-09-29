import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import { observePetRows, PetRow } from '@/database/repositories/lists';
import { useObservable } from '@/database/hooks/useObservable';
import { useConnectionIndicator } from '@/database/sync';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useAuth } from '@/contexts/AuthContext';
import { formatAge, speciesToIcon } from '@/utils/format';
import { applyFilters, distinctChipOptions, isFilterActive, makeEmptyFilterState, type FilterState } from '@/utils/filter';
import { applySort, makeSortState, sortByDate, sortByString, type SortOption, type SortState } from '@/utils/sort';
import { EmptyListMessage } from '../../components/EmptyListMessage';
import { FilterSheet } from '../../components/FilterSheet';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import { PetCard, PetCardData } from '../../components/PetCard';
import { SearchBar } from '../../components/SearchBar';
import { SortSheet } from '../../components/SortSheet';
import { ViewSortFilterBar } from '../../components/ViewSortFilterBar';

const SORT_OPTIONS: SortOption[] = [
  { key: 'nome', label: 'Nome', ascLabel: 'Nome (A-Z)', descLabel: 'Nome (Z-A)', defaultDirection: 'asc' },
  {
    key: 'idade',
    label: 'Idade',
    ascLabel: 'Mais velhos primeiro',
    descLabel: 'Mais novos primeiro',
    defaultDirection: 'asc',
  },
  { key: 'tutor', label: 'Tutor', ascLabel: 'Tutor (A-Z)', descLabel: 'Tutor (Z-A)', defaultDirection: 'asc' },
];

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
  const syncStatus = useConnectionIndicator();
  const [search, setSearch] = useState('');
  const [sortState, setSortState] = useState<SortState>(() => makeSortState(SORT_OPTIONS));
  const [filterState, setFilterState] = useState<FilterState>(makeEmptyFilterState);
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const router = useRouter();

  const petRows = useObservable<PetRow[]>(
    () => (veterinario ? observePetRows(veterinario.id) : of([])),
    [veterinario],
    [],
  );

  const filterGroups = useMemo(
    () => [
      { key: 'especie', title: 'Espécie', options: distinctChipOptions(petRows, (row) => row.pet.especie) },
      { key: 'raca', title: 'Raça', options: distinctChipOptions(petRows, (row) => row.pet.raca) },
    ],
    [petRows],
  );

  const filteredRows = useMemo(
    () =>
      applyFilters(
        petRows,
        filterState,
        { especie: (row) => row.pet.especie, raca: (row) => row.pet.raca },
        {},
      ),
    [petRows, filterState],
  );

  const searchedRows = useSearchFilter(filteredRows, search);

  const visibleRows = useMemo(
    () =>
      applySort(searchedRows, sortState, {
        nome: sortByString((row) => row.pet.nome, sortState.direction),
        idade: sortByDate((row) => row.pet.dataNascimento, sortState.direction),
        tutor: sortByString((row) => row.tutor?.nomeCompleto, sortState.direction),
      }),
    [searchedRows, sortState],
  );

  const handleFilter = () => setFilterVisible(true);

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
      <Header title="Pets" syncStatus={syncStatus} />
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Pesquisar por pet, raça ou tutor..."
      />
      <ViewSortFilterBar
        onViewPress={() => {}}
        onSortPress={() => setSortVisible(true)}
        onFilterPress={handleFilter}
        filterActive={isFilterActive(filterState)}
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
          search.trim() || isFilterActive(filterState) ? (
            <EmptyListMessage
              title="Nenhum pet encontrado"
              subtitle="Ajuste a pesquisa ou os filtros aplicados."
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

      <SortSheet
        visible={sortVisible}
        options={SORT_OPTIONS}
        value={sortState}
        onChange={setSortState}
        onClose={() => setSortVisible(false)}
      />

      <FilterSheet
        visible={filterVisible}
        chipGroups={filterGroups}
        toggles={[]}
        value={filterState}
        onChange={setFilterState}
        onClear={() => setFilterState(makeEmptyFilterState())}
        onClose={() => setFilterVisible(false)}
      />
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
