import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { of } from 'rxjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observeTutorRows, TutorRow } from '@/database/repositories/lists';
import { useObservable } from '@/database/hooks/useObservable';
import { useConnectionIndicator } from '@/database/sync';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useAuth } from '@/contexts/AuthContext';
import { applyFilters, distinctChipOptions, isFilterActive, makeEmptyFilterState, type FilterState } from '@/utils/filter';
import { applySort, makeSortState, sortByNumber, sortByString, type SortOption, type SortState } from '@/utils/sort';
import { GRID_COLUMNS, padGridRows, type GridItem } from '@/utils/grid';
import { EmptyListMessage } from '../../components/EmptyListMessage';
import { FilterSheet } from '../../components/FilterSheet';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import { OwnerCard, OwnerCardData } from '../../components/OwnerCard';
import { SearchBar } from '../../components/SearchBar';
import { SortSheet } from '../../components/SortSheet';
import { ViewSortFilterBar, type ViewMode } from '../../components/ViewSortFilterBar';

const SORT_OPTIONS: SortOption[] = [
  { key: 'nome', label: 'Nome', ascLabel: 'Nome (A-Z)', descLabel: 'Nome (Z-A)', defaultDirection: 'asc' },
  {
    key: 'pets',
    label: 'Quantidade de pets',
    ascLabel: 'Menos pets primeiro',
    descLabel: 'Mais pets primeiro',
    defaultDirection: 'desc',
  },
  { key: 'cidade', label: 'Cidade', ascLabel: 'Cidade (A-Z)', descLabel: 'Cidade (Z-A)', defaultDirection: 'asc' },
];

function toOwnerCardData({ tutor, pets }: TutorRow): OwnerCardData {
  return {
    id: tutor.id,
    name: tutor.nomeCompleto,
    pets: pets.map((pet) => pet.nome),
    photoUrl: tutor.avatarUrl ?? undefined,
  };
}

export default function TutoresScreen() {
  const { veterinario } = useAuth();
  const syncStatus = useConnectionIndicator();
  const [search, setSearch] = useState('');
  const [sortState, setSortState] = useState<SortState>(() => makeSortState(SORT_OPTIONS));
  const [filterState, setFilterState] = useState<FilterState>(makeEmptyFilterState);
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const router = useRouter();
  const isGrid = viewMode === 'grid';

  const tutorRows = useObservable<TutorRow[]>(
    () => (veterinario ? observeTutorRows(veterinario.id) : of([])),
    [veterinario],
    [],
  );

  const filterGroups = useMemo(
    () => [
      { key: 'cidade', title: 'Cidade', options: distinctChipOptions(tutorRows, (row) => row.tutor.cidade) },
      { key: 'uf', title: 'UF', options: distinctChipOptions(tutorRows, (row) => row.tutor.uf) },
    ],
    [tutorRows],
  );

  const filteredRows = useMemo(
    () =>
      applyFilters(
        tutorRows,
        filterState,
        { cidade: (row) => row.tutor.cidade, uf: (row) => row.tutor.uf },
        { comPets: (row) => row.pets.length > 0 },
      ),
    [tutorRows, filterState],
  );

  const searchedRows = useSearchFilter(filteredRows, search);

  const visibleRows = useMemo(
    () =>
      applySort(searchedRows, sortState, {
        nome: sortByString((row) => row.tutor.nomeCompleto, sortState.direction),
        pets: sortByNumber((row) => row.pets.length, sortState.direction),
        cidade: sortByString((row) => row.tutor.cidade, sortState.direction),
      }),
    [searchedRows, sortState],
  );

  const listData = useMemo<GridItem<TutorRow>[]>(
    () => (isGrid ? padGridRows(visibleRows) : visibleRows.map((row) => ({ id: row.id, row }))),
    [visibleRows, isGrid],
  );

  const handleCardPress = (id: string) => {
    router.push({
      params: { id },
      pathname: '/(modals)/tutores/details'
    });
  };
  const handleAddPress = () => {
    router.push('/(modals)/tutores/new');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Tutores" syncStatus={syncStatus} />
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Pesquisar por nome, CPF, telefone ou pet..."
      />
      <ViewSortFilterBar
        viewMode={viewMode}
        onViewPress={() => setViewMode(isGrid ? 'list' : 'grid')}
        onSortPress={() => setSortVisible(true)}
        onFilterPress={() => setFilterVisible(true)}
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
            <OwnerCard data={toOwnerCardData(item.row)} onPress={handleCardPress} layout={viewMode} />
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
              title="Nenhum tutor encontrado"
              subtitle="Ajuste a pesquisa ou os filtros aplicados."
            />
          ) : (
            <EmptyListMessage
              icon="account-outline"
              title="Nenhum tutor cadastrado"
              subtitle="Toque no botão + para cadastrar o primeiro tutor."
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
        toggles={[{ key: 'comPets', label: 'Somente tutores com pets cadastrados' }]}
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
  gridContent: {
    paddingHorizontal: 10,
    paddingBottom: 100,
    paddingTop: 10
  },
  listContent: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'flex-start',
  },
  emptyCard: {
    width: '31%',
    marginHorizontal: '1.16%',
  },
});
