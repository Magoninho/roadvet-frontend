import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import { observeProntuarioRows, ProntuarioRow } from '@/database/repositories/lists';
import { useObservable } from '@/database/hooks/useObservable';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useAuth } from '@/contexts/AuthContext';
import { formatDateBR, speciesToIcon } from '@/utils/format';
import { EmptyListMessage } from '../../components/EmptyListMessage';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import { RecordCard, RecordCardData } from '../../components/RecordCard';
import { SearchBar } from '../../components/SearchBar';
import { SortFilterBar } from '../../components/SortFilterBar';

function toRecordCardData({ prontuario, pet }: ProntuarioRow): RecordCardData {
  const badges: RecordCardData['badges'] = [];
  if (prontuario.prescription) badges.push('medication');
  if (prontuario.examRequestNotes) badges.push('exam');

  return {
    id: prontuario.id,
    petName: pet?.nome ?? '',
    species: pet ? speciesToIcon(pet.especie) : 'paw',
    description: prontuario.anamnesis || prontuario.physicalExam || 'Consulta registrada',
    badges,
    date: formatDateBR(prontuario.date),
    synced: true,
  };
}

export default function ProntuariosScreen() {
  const { veterinario } = useAuth();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const prontuarioRows = useObservable<ProntuarioRow[]>(
    () => (veterinario ? observeProntuarioRows(veterinario.id) : of([])),
    [veterinario],
    [],
  );
  const visibleRows = useSearchFilter(prontuarioRows, search);

  const handleSort = () => {
    // abrir modal / lógica de ordenação
  };

  const handleFilter = () => {
    // abrir modal / lógica de filtro
  };

  const handleCardPress = (id: string) => {
    router.push({
      params: { prontuarioId: id },
      pathname: '/(modals)/prontuarios/details'
    });
  };

  const handleAddPress = () => {
    router.navigate('/(modals)/prontuarios/select');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Prontuários" />
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Pesquisar por pet, tutor, data ou anotação..."
      />
      <SortFilterBar onSortPress={handleSort} onFilterPress={handleFilter} />

      <FlatList
        data={visibleRows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordCard data={toRecordCardData(item)} onPress={handleCardPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          search.trim() ? (
            <EmptyListMessage
              title={`Nenhum prontuário encontrado para "${search.trim()}"`}
              subtitle="Pesquise pelo pet, tutor, data da consulta, prescrição ou qualquer anotação clínica."
            />
          ) : (
            <EmptyListMessage
              icon="file-document-outline"
              title="Nenhum prontuário registrado"
              subtitle="Toque no botão + para registrar a primeira consulta."
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
    paddingBottom: 100,
  },
});
