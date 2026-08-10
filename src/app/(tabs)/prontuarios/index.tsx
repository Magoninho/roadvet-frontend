import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import { RecordCard, RecordCardData } from '../../components/RecordCard';
import { SearchBar } from '../../components/SearchBar';
import { SortFilterBar } from '../../components/SortFilterBar';

const MOCK_DATA: RecordCardData[] = [
  {
    id: '1',
    petName: 'Floquinho',
    species: "dog",
    description:
      'Apresentou dores na pata e tomou antibióticos, tomou dose de vacina antirrábica',
    badges: ['medication', 'vaccine'],
    date: '22/04/2026',
    synced: true,
  },
  {
    id: '2',
    petName: 'Cascão',
    description: 'Foram solicitados exames',
    species: "cat",
    badges: ['exam'],
    date: '22/04/2026',
    synced: true,
  },
  {
    id: '3',
    petName: 'Mingau',
    species: "cat",
    description:
      'Tomou dose de vacina polivalente e foram solicitados exames...',
    badges: ['medication', 'exam'],
    date: '22/04/2026',
    synced: false,
  },
];

export default function ProntuariosScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSort = () => {
    // abrir modal / lógica de ordenação
  };

  const handleFilter = () => {
    // abrir modal / lógica de filtro
  };

  const handleCardPress = (id: string) => {
    // navegar para detalhe do prontuário
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
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordCard data={item} onPress={handleCardPress} />
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
