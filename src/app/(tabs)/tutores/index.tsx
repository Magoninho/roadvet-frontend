import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, SafeAreaView, View } from 'react-native';
import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { ViewSortFilterBar } from '../../components/ViewSortFilterBar';
import { OwnerCard, OwnerCardData } from '../../components/OwnerCard';
import { FloatingActionButton } from '../../components/FloatingActionButton';

const NUM_COLUMNS = 3;

const MOCK_OWNERS: OwnerCardData[] = [
  { id: '1', name: 'Magali', pets: ['Mingau'], photoUrl: 'https://static.wikia.nocookie.net/monica/images/4/4f/Magali_Lima.png/revision/latest?cb=20260420233335&path-prefix=pt-br' },
  { id: '2', name: 'Franjinha', pets: ['Bidu'], photoUrl: 'https://static.wikia.nocookie.net/monica/images/3/3b/Franjinha_em_fundo_branco.jpeg/revision/latest/smart/width/250/height/250?cb=20250508134316&path-prefix=pt-br' },
  { id: '3', name: 'Cebolinha', pets: ['Floquinho'], photoUrl: 'https://static.wikia.nocookie.net/monica/images/9/91/Cebolinha_Junior.png/revision/latest?cb=20260420233226&path-prefix=pt-br' },
  { id: '4', name: 'Mônica', pets: ['Monicão'], photoUrl: 'https://static.wikia.nocookie.net/monica/images/9/91/M%C3%B4nica_Sousa_e_Sans%C3%A3o.png/revision/latest/scale-to-width-down/1000?cb=20260418070809&path-prefix=pt-br' },
];

type ListItem = OwnerCardData | { id: string; empty: true };

function fillWithEmptyItems(data: OwnerCardData[]): ListItem[] {
  const remainder = data.length % NUM_COLUMNS;
  if (remainder === 0) return data;

  const emptyItemsCount = NUM_COLUMNS - remainder;
  const emptyItems: ListItem[] = Array.from({ length: emptyItemsCount }).map(
    (_, index) => ({ id: `empty-${index}`, empty: true })
  );

  return [...data, ...emptyItems];
}

export default function TutoresScreen() {
  const [search, setSearch] = useState('');

  const listData = useMemo(() => fillWithEmptyItems(MOCK_OWNERS), []);

  const handleView = () => {};
  const handleSort = () => {};
  const handleFilter = () => {};
  const handleCardPress = (id: string) => {};
  const handleAddPress = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Tutores" syncStatus="synced" />
      <SearchBar value={search} onChangeText={setSearch} />
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
            <OwnerCard data={item} onPress={handleCardPress} />
          )
        }
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
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