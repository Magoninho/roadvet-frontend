import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, SafeAreaView, View } from 'react-native';
import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { ViewSortFilterBar } from '../../components/ViewSortFilterBar';
import { OwnerCard, OwnerCardData } from '../../components/OwnerCard';
import { FloatingActionButton } from '../../components/FloatingActionButton';

const NUM_COLUMNS = 3;

const MOCK_OWNERS: OwnerCardData[] = [
  { id: '1', name: 'Fulaninho', pets: ['Mingau'] },
  { id: '2', name: 'Beltrano', pets: ['Devorador', 'Destruidor'] },
  { id: '3', name: 'Sicrano', pets: ['Amora'] },
  { id: '4', name: 'Sicrano', pets: ['Amora'] },
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