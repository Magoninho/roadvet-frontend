import React, { useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { ViewSortFilterBar } from '../../components/ViewSortFilterBar';
import { PetCard, PetCardData } from '../../components/PetCard';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { useRouter } from 'expo-router';

const MOCK_PETS: PetCardData[] = [
  {
    id: '1',
    name: 'Mingau',
    age: '6 anos',
    gender: 'Macho',
    breed: 'Angorá',
    ownerName: 'Magali',
    species: 'cat',
    synced: true,
    photoUrl: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fmonica%2Fimages%2F5%2F5a%2FMingau_%2528foto_promocional%2529.jpg%2Frevision%2Flatest%3Fcb%3D20180728012816%26path-prefix%3Dpt-br&cx=400'
  },
  {
    id: '2',
    name: 'Floquinho',
    age: '10 anos',
    gender: 'Macho',
    breed: 'Lhasa Apso',
    ownerName: 'Cebolinha',
    species: 'dog',
    synced: true,
    photoUrl: 'https://static.wikia.nocookie.net/monica/images/b/b8/Floquinho_em_fundo_branco.png/revision/latest?cb=20250421203021&path-prefix=pt-br'
  },
  {
    id: '3',
    name: 'Bidu',
    age: '6 anos',
    gender: 'Macho',
    breed: 'Schnauzer',
    ownerName: 'Franjinha',
    species: 'cat',
    synced: true,
    photoUrl: 'https://static.wikia.nocookie.net/monica/images/5/59/Bidu_transparente.png/revision/latest?cb=20231022195750&path-prefix=pt-br'
  },
  {
    id: '4',
    name: 'Monicão',
    age: '4 anos',
    gender: 'Macho',
    breed: 'SRD',
    ownerName: 'Mônica',
    species: 'dog',
    synced: true,
    photoUrl: 'https://static.wikia.nocookie.net/monica/images/6/61/Monic%C3%A3o_em_fundo_branco.png/revision/latest/scale-to-width-down/1000?cb=20250421150545&path-prefix=pt-br'
  },
];

export default function PetsScreen() {
  const [search, setSearch] = useState('');

  const router = useRouter();

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
      params: { id: id },
      pathname: '/(tabs)/pets/details'
    });
  };

  const handleAddPress = () => {
    router.navigate('/(tabs)/pets/newPetScreen');
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
