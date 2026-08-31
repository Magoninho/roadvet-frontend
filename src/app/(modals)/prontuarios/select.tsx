import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import Pet from '@/database/models/Pet';
import Tutor from '@/database/models/Tutor';
import { observePetsByVeterinario } from '@/database/repositories/pets';
import { useObservable } from '@/database/hooks/useObservable';
import { useAuth } from '@/contexts/AuthContext';
import { formatAge, speciesToIcon } from '@/utils/format';
import { BackHeader } from '../../components/BackHeader';
import { PetCard, PetCardData } from '../../components/PetCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SearchBar } from '../../components/SearchBar';
import { SectionLabel } from '../../components/SectionLabel';
import { PetFormModal } from '@/app/components/PetFormModal';

function PetCardContainer({ pet, onPress }: { pet: Pet; onPress: (id: string) => void }) {
  const tutor = useObservable<Tutor | null>(() => pet.tutor.observe(), [pet.id], null);

  const data: PetCardData = {
    id: pet.id,
    name: pet.nome,
    age: formatAge(pet.dataNascimento),
    breed: pet.raca,
    ownerName: tutor?.nomeCompleto ?? '',
    species: speciesToIcon(pet.especie),
    synced: true,
    photoUrl: pet.avatarUrl ?? undefined,
  };

  return <PetCard data={data} onPress={onPress} />;
}

export default function ProntuarioSelection() {
  const { veterinario } = useAuth();
  const [search, setSearch] = useState('');
  const [modalPetVisible, setModalPetVisible] = useState(false);

  const router = useRouter();

  const pets = useObservable(
    () => (veterinario ? observePetsByVeterinario(veterinario.id) : of([])),
    [veterinario],
    [],
  );
  const filteredPets = search.trim()
    ? pets.filter((pet) => pet.nome.toLowerCase().includes(search.trim().toLowerCase()))
    : pets;

  const handleBack = () => {
    router.back();
  };

  const handleNewPet = () => {
    setModalPetVisible(true);
  };

  const handleSaveNewPet = (pet: Pet) => {
    setModalPetVisible(false);
    router.push({ pathname: '/(modals)/prontuarios/new', params: { petId: pet.id } });
  };

  const handleSelectPet = (id: string) => {
    router.push({
      pathname: '/(modals)/prontuarios/new',
      params: { petId: id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Criar prontuário" onBackPress={handleBack} />
      <SearchBar value={search} onChangeText={setSearch} />
      <PrimaryButton label="Novo pet" onPress={handleNewPet} />
      <SectionLabel text="Pets cadastrados" />

      <FlatList
        data={filteredPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCardContainer pet={item} onPress={handleSelectPet} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <PetFormModal
        visible={modalPetVisible}
        onCancel={() => setModalPetVisible(false)}
        onSave={handleSaveNewPet}
        showTutorSection={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 40,
  },
});
