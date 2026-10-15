import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import { observeProntuarioRows, ProntuarioRow } from '@/database/repositories/lists';
import { useObservable } from '@/database/hooks/useObservable';
import { useConnectionIndicator } from '@/database/sync';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useAuth } from '@/contexts/AuthContext';
import { formatDateBR, speciesToIcon } from '@/utils/format';
import { applyFilters, distinctChipOptions, isFilterActive, makeEmptyFilterState, type FilterState } from '@/utils/filter';
import { applySort, makeSortState, sortByDate, sortByString, type SortOption, type SortState } from '@/utils/sort';
import { EmptyListMessage } from '../../components/EmptyListMessage';
import { FilterSheet } from '../../components/FilterSheet';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import { RecordCard, RecordCardData } from '../../components/RecordCard';
import { SearchBar } from '../../components/SearchBar';
import { SortFilterBar } from '../../components/SortFilterBar';
import { SortSheet } from '../../components/SortSheet';
import { COLORS } from '@/theme';

const SORT_OPTIONS: SortOption[] = [
  {
    key: 'data',
    label: 'Data da consulta',
    ascLabel: 'Mais antigas primeiro',
    descLabel: 'Mais recentes primeiro',
    defaultDirection: 'desc',
  },
  { key: 'pet', label: 'Pet', ascLabel: 'Pet (A-Z)', descLabel: 'Pet (Z-A)', defaultDirection: 'asc' },
  { key: 'tutor', label: 'Tutor', ascLabel: 'Tutor (A-Z)', descLabel: 'Tutor (Z-A)', defaultDirection: 'asc' },
];

function toRecordCardData({ prontuario, pet }: ProntuarioRow): RecordCardData {
  const badges: RecordCardData['badges'] = [];
  if (prontuario.prescription) badges.push('medication');
  if (prontuario.vaccines) badges.push('vaccine');
  if (prontuario.examRequestNotes) badges.push('exam');

  return {
    id: prontuario.id,
    petName: pet?.nome ?? '',
    species: pet ? speciesToIcon(pet.especie) : 'paw',
    description: prontuario.anamnesis || prontuario.physicalExam || 'Consulta registrada',
    badges,
    date: formatDateBR(prontuario.date),
    synced: true,
  };
}

export default function ProntuariosScreen() {
  const { veterinario } = useAuth();
  const syncStatus = useConnectionIndicator();
  const [search, setSearch] = useState('');
  const [sortState, setSortState] = useState<SortState>(() => makeSortState(SORT_OPTIONS));
  const [filterState, setFilterState] = useState<FilterState>(makeEmptyFilterState);
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const router = useRouter();

  const prontuarioRows = useObservable<ProntuarioRow[]>(
    () => (veterinario ? observeProntuarioRows(veterinario.id) : of([])),
    [veterinario],
    [],
  );

  const filterGroups = useMemo(
    () => [
      { key: 'especie', title: 'Espécie do pet', options: distinctChipOptions(prontuarioRows, (row) => row.pet?.especie) },
    ],
    [prontuarioRows],
  );

  const filteredRows = useMemo(
    () =>
      applyFilters(
        prontuarioRows,
        filterState,
        { especie: (row) => row.pet?.especie },
        {
          comPrescricao: (row) => !!row.prontuario.prescription,
          comExame: (row) => !!row.prontuario.examRequestNotes,
        },
      ),
    [prontuarioRows, filterState],
  );

  const searchedRows = useSearchFilter(filteredRows, search);

  const visibleRows = useMemo(
    () =>
      applySort(searchedRows, sortState, {
        data: sortByDate((row) => row.prontuario.date, sortState.direction),
        pet: sortByString((row) => row.pet?.nome, sortState.direction),
        tutor: sortByString((row) => row.tutor?.nomeCompleto, sortState.direction),
      }),
    [searchedRows, sortState],
  );

  const handleCardPress = (id: string) => {
    router.push({
      params: { prontuarioId: id },
      pathname: '/(modals)/prontuarios/details'
    });
  };

  const handleAddPress = () => {
    router.navigate('/(modals)/prontuarios/select');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header title="Prontuários" syncStatus={syncStatus} />
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Pesquisar por pet, tutor, data ou anotação..."
      />
      <SortFilterBar
        onSortPress={() => setSortVisible(true)}
        onFilterPress={() => setFilterVisible(true)}
        filterActive={isFilterActive(filterState)}
      />

      <FlatList
        data={visibleRows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordCard data={toRecordCardData(item)} onPress={handleCardPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          search.trim() || isFilterActive(filterState) ? (
            <EmptyListMessage
              title="Nenhum prontuário encontrado"
              subtitle="Ajuste a pesquisa ou os filtros aplicados."
            />
          ) : (
            <EmptyListMessage
              icon="file-document-outline"
              title="Nenhum prontuário registrado"
              subtitle="Toque no botão + para registrar a primeira consulta."
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
        toggles={[
          { key: 'comPrescricao', label: 'Com prescrição' },
          { key: 'comExame', label: 'Com pedido de exame' },
        ]}
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
});
