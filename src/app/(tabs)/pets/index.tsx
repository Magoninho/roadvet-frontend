import React, { useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { ViewSortFilterBar } from '../../components/ViewSortFilterBar';
import { PetCard, PetCardData } from '../../components/PetCard';
import { FloatingActionButton } from '../../components/FloatingActionButton';

const MOCK_PETS: PetCardData[] = [
  {
    id: '1',
    name: 'Mingau',
    age: '6 anos',
    gender: 'Macho',
    breed: 'SRD',
    ownerName: 'Fulaninho da Silva',
    species: 'cat',
    synced: true,
  },
  {
    id: '2',
    name: 'Devorador de almas',
    age: '10 anos',
    gender: 'Macho',
    breed: 'Pinscher',
    ownerName: 'Fulaninho da Silva',
    species: 'dog',
    synced: true,
  },
  {
    id: '3',
    name: 'Destruidor de asteróides',
    age: '8 anos',
    gender: 'Macho',
    breed: 'Pitbull',
    ownerName: 'Fulaninho da Silva',
    species: 'dog',
    synced: true,
  },
  {
    id: '4',
    name: 'Amora',
    age: '10 anos',
    gender: 'Fêmea',
    breed: 'Chihuahua',
    ownerName: 'Fulaninho da Silva',
    species: 'dog',
    synced: true,
  },
];

export default function PetsScreen() {
  const [search, setSearch] = useState('');

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
    // navegar para detalhe do pet
  };

  const handleAddPress = () => {
    // navegar para cadastro de novo pet
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
        data={MOCK_PETS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard data={item} onPress={handleCardPress} />
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
