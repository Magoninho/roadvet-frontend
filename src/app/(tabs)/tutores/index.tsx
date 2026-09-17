import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { of } from 'rxjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observeTutorRows, TutorRow } from '@/database/repositories/lists';
import { useObservable } from '@/database/hooks/useObservable';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useAuth } from '@/contexts/AuthContext';
import { EmptyListMessage } from '../../components/EmptyListMessage';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import { OwnerCard, OwnerCardData } from '../../components/OwnerCard';
import { SearchBar } from '../../components/SearchBar';
import { ViewSortFilterBar } from '../../components/ViewSortFilterBar';

const NUM_COLUMNS = 3;

type ListItem = { id: string; row: TutorRow } | { id: string; empty: true };

function fillWithEmptyItems(rows: TutorRow[]): ListItem[] {
  const data: ListItem[] = rows.map((row) => ({ id: row.id, row }));
  const remainder = data.length % NUM_COLUMNS;
  if (remainder === 0) return data;

  const emptyItemsCount = NUM_COLUMNS - remainder;
  const emptyItems: ListItem[] = Array.from({ length: emptyItemsCount }).map(
    (_, index) => ({ id: `empty-${index}`, empty: true })
  );

  return [...data, ...emptyItems];
}

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
  const [search, setSearch] = useState('');
  const router = useRouter();

  const tutorRows = useObservable<TutorRow[]>(
    () => (veterinario ? observeTutorRows(veterinario.id) : of([])),
    [veterinario],
    [],
  );
  const visibleRows = useSearchFilter(tutorRows, search);

  const listData = useMemo(() => fillWithEmptyItems(visibleRows), [visibleRows]);

  const handleView = () => {};
  const handleSort = () => {};
  const handleFilter = () => {};
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
      <Header title="Tutores" syncStatus="synced" />
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Pesquisar por nome, CPF, telefone ou pet..."
      />
      <ViewSortFilterBar
        onViewPress={handleView}
        onSortPress={handleSort}
        onFilterPress={handleFilter}
      />

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          'empty' in item ? (
            <View style={styles.emptyCard} />
          ) : (
            <OwnerCard data={toOwnerCardData(item.row)} onPress={handleCardPress} />
          )
        }
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          search.trim() ? (
            <EmptyListMessage
              title={`Nenhum tutor encontrado para "${search.trim()}"`}
              subtitle="Pesquise pelo nome, CPF, e-mail, telefone, cidade ou pelo nome de um pet."
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 100,
    paddingTop: 10
  },
  row: {
    justifyContent: 'flex-start',
  },
  emptyCard: {
    width: '31%',
    marginHorizontal: '1.16%',
  },
});
