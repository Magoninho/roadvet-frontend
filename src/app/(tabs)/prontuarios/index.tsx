import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Prontuario from '@/database/models/Prontuario';
import Pet from '@/database/models/Pet';
import { observeAllProntuarios } from '@/database/repositories/prontuarios';
import { useObservable } from '@/database/hooks/useObservable';
import { formatDateBR, speciesToIcon } from '@/utils/format';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import { RecordCard, RecordCardData } from '../../components/RecordCard';
import { SearchBar } from '../../components/SearchBar';
import { SortFilterBar } from '../../components/SortFilterBar';

function RecordCardContainer({ prontuario, onPress }: { prontuario: Prontuario; onPress: (id: string) => void }) {
  const pet = useObservable<Pet | null>(() => prontuario.pet.observe(), [prontuario.id], null);

  const badges: RecordCardData['badges'] = [];
  if (prontuario.prescription) badges.push('medication');
  if (prontuario.examRequestNotes) badges.push('exam');

  const data: RecordCardData = {
    id: prontuario.id,
    petName: pet?.nome ?? '',
    species: pet ? speciesToIcon(pet.especie) : 'paw',
    description: prontuario.anamnesis || prontuario.physicalExam || 'Consulta registrada',
    badges,
    date: formatDateBR(prontuario.date),
    synced: true,
  };

  return <RecordCard data={data} onPress={onPress} />;
}

export default function ProntuariosScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const prontuarios = useObservable(() => observeAllProntuarios(), [], []);

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
      <SearchBar value={search} onChangeText={setSearch} />
      <SortFilterBar onSortPress={handleSort} onFilterPress={handleFilter} />

      <FlatList
        data={prontuarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordCardContainer prontuario={item} onPress={handleCardPress} />
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
