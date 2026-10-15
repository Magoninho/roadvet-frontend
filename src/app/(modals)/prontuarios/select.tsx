import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import Pet from '@/database/models/Pet';
import { observePetRows, PetRow } from '@/database/repositories/lists';
import { useObservable } from '@/database/hooks/useObservable';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useAuth } from '@/contexts/AuthContext';
import { formatAge, speciesToIcon } from '@/utils/format';
import { BackHeader } from '../../components/BackHeader';
import { EmptyListMessage } from '../../components/EmptyListMessage';
import { PetCard, PetCardData } from '../../components/PetCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SearchBar } from '../../components/SearchBar';
import { SectionLabel } from '../../components/SectionLabel';
import { PetFormModal } from '@/app/components/PetFormModal';
import { COLORS, SPACING } from '@/theme';

function toPetCardData({ pet, tutor }: PetRow): PetCardData {
  return {
    id: pet.id,
    name: pet.nome,
    age: formatAge(pet.dataNascimento),
    breed: pet.raca,
    ownerName: tutor?.nomeCompleto ?? '',
    species: speciesToIcon(pet.especie),
    synced: true,
    photoUrl: pet.avatarUrl ?? undefined,
  };
}

export default function ProntuarioSelection() {
  const { veterinario } = useAuth();
  const [search, setSearch] = useState('');
  const [modalPetVisible, setModalPetVisible] = useState(false);

  const router = useRouter();

  const petRows = useObservable<PetRow[]>(
    () => (veterinario ? observePetRows(veterinario.id) : of([])),
    [veterinario],
    [],
  );
  const visibleRows = useSearchFilter(petRows, search);

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
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <BackHeader title="Criar prontuário" onBackPress={handleBack} />
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Pesquisar por pet, raça ou tutor..."
      />
      <PrimaryButton label="Novo pet" onPress={handleNewPet} />
      <SectionLabel text="Pets cadastrados" />

      <FlatList
        data={visibleRows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard data={toPetCardData(item)} onPress={handleSelectPet} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          search.trim() ? (
            <EmptyListMessage
              title={`Nenhum pet encontrado para "${search.trim()}"`}
              subtitle="Pesquise pelo nome do pet, raça, espécie ou pelo tutor."
            />
          ) : (
            <EmptyListMessage
              icon="paw"
              title="Nenhum pet cadastrado"
              subtitle='Use "Novo pet" para cadastrar antes de criar o prontuário.'
            />
          )
        }
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
    backgroundColor: COLORS.bg,
  },
  listContent: {
    paddingBottom: SPACING.block,
  },
});
