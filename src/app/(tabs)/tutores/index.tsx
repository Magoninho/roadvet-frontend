import React, { useState } from 'react';
import { FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { ViewSortFilterBar } from '../../components/ViewSortFilterBar';
import { OwnerCard, OwnerCardData } from '../../components/OwnerCard';
import { FloatingActionButton } from '../../components/FloatingActionButton';

const MOCK_OWNERS: OwnerCardData[] = [
  { id: '1', name: 'Fulaninho', pets: ['Mingau'] },
  { id: '2', name: 'Beltrano', pets: ['Devorador', 'Destruidor'] },
  { id: '3', name: 'Sicrano', pets: ['Amora'] },
];

export default function TutoresScreen() {
  const [search, setSearch] = useState('');

  const handleView = () => {
    // alternar visualização
  };

  const handleSort = () => {
    // abrir modal de ordenação
  };

  const handleFilter = () => {
    // abrir modal de filtro
  };

  const handleCardPress = (id: string) => {
    // navegar para detalhe do tutor
  };

  const handleAddPress = () => {
    // navegar para cadastro de novo tutor
  };

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
        data={MOCK_OWNERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OwnerCard data={item} onPress={handleCardPress} />
        )}
        numColumns={3}
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
  },
  row: {
    justifyContent: 'flex-start',
  },
});
