import React, { useMemo } from 'react';
import { FlatList, StyleSheet, SafeAreaView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BackHeader, SearchBar, PrimaryButton, SectionLabel } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { PetCard, PetCardData } from '../../pets/components/PetCard';
import { usePets } from '../../pets/hooks/usePets';

export function NewProntuarioPetSelectContainer() {
  const { pets, searchQuery, setSearchQuery } = usePets();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleNewPet = () => {
    router.navigate('/(tabs)/pets/newPetScreen');
  };

  const handleSelectPet = (id: string) => {
    router.push({
      pathname: '/prontuarios/newProntuarioFormScreen',
      params: { petId: id },
    });
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Criar prontuário" onBackPress={handleBack} />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <PrimaryButton label="Novo pet" onPress={handleNewPet} />
      <View style={styles.sectionLabelWrapper}>
        <SectionLabel label="Pets cadastrados" />
      </View>

      <FlatList
        data={formattedPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard data={item} onPress={handleSelectPet} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  sectionLabelWrapper: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  listContent: {
    paddingBottom: 40,
  },
});
