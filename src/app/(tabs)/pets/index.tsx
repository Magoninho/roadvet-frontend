import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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
import { GRID_COLUMNS, padGridRows, type GridItem } from '@/utils/grid';
import { EmptyListMessage } from '../../components/EmptyListMessage';
import { FilterSheet } from '../../components/FilterSheet';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import { PetCard, PetCardData } from '../../components/PetCard';
import { SearchBar } from '../../components/SearchBar';
import { SortSheet } from '../../components/SortSheet';
import { ViewSortFilterBar, type ViewMode } from '../../components/ViewSortFilterBar';
import { COLORS, SPACING } from '@/theme';

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
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const router = useRouter();
  const isGrid = viewMode === 'grid';

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

  const listData = useMemo<GridItem<PetRow>[]>(
    () => (isGrid ? padGridRows(visibleRows) : visibleRows.map((row) => ({ id: row.id, row }))),
    [visibleRows, isGrid],
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
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header title="Pets" syncStatus={syncStatus} />
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Pesquisar por pet, raça ou tutor..."
      />
      <ViewSortFilterBar
        viewMode={viewMode}
        onViewPress={() => setViewMode(isGrid ? 'list' : 'grid')}
        onSortPress={() => setSortVisible(true)}
        onFilterPress={handleFilter}
        filterActive={isFilterActive(filterState)}
      />

      <FlatList
        // FlatList can't change numColumns on the fly; a new key remounts it for the other layout.
        key={viewMode}
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          'empty' in item ? (
            <View style={styles.emptyCard} />
          ) : (
            <PetCard data={toPetCardData(item.row)} onPress={handleCardPress} layout={viewMode} />
          )
        }
        numColumns={isGrid ? GRID_COLUMNS : 1}
        contentContainerStyle={isGrid ? styles.gridContent : styles.listContent}
        columnWrapperStyle={isGrid ? styles.row : undefined}
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
    backgroundColor: COLORS.bg,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 100,
  },
  // Cards keep a 1.16% side margin, so this plus that margin lines up with the 20px gutter.
  gridContent: {
    paddingHorizontal: SPACING.gutter - 4,
    paddingBottom: 100,
    paddingTop: 16,
  },
  row: {
    justifyContent: 'flex-start',
  },
  emptyCard: {
    width: '31%',
    marginHorizontal: '1.16%',
  },
});
