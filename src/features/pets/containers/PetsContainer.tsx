import React, { useMemo } from 'react';
import { FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Header,
  SearchBar,
  ViewSortFilterBar,
  FloatingActionButton,
} from '../../../ui/components';
import { colors } from '../../../ui/theme';
import { PetCard, PetCardData } from '../components/PetCard';
import { usePets } from '../hooks/usePets';

export function PetsContainer() {
  const { pets, searchQuery, setSearchQuery } = usePets();
  const router = useRouter();

  const formattedPets: PetCardData[] = useMemo(() => {
    return pets.map((p) => ({
      id: p.id,
      name: p.name,
      age: p.birthDate || 'Idade n/d',
      gender: 'Macho',
      breed: p.breed || 'SRD',
      ownerName: p.tutorName,
      species: p.species.toLowerCase().includes('gato') || p.species.toLowerCase().includes('felino') ? 'cat' : 'dog',
      synced: p.isSynced,
    }));
  }, [pets]);

  const handleAddPress = () => {
    router.navigate('/(tabs)/pets/newPetScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Pets" syncStatus="synced" />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <ViewSortFilterBar
        onViewPress={() => {}}
        onSortPress={() => {}}
        onFilterPress={() => {}}
      />

      <FlatList
        data={formattedPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard data={item} onPress={() => {}} />
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
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 100,
  },
});
