import React, { useMemo } from 'react';
import { FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, SearchBar, SortFilterBar, FloatingActionButton } from '../../../ui/components';
import { colors } from '../../../ui/theme';
import { RecordCard, RecordCardData } from '../components/RecordCard';
import { useProntuarios } from '../hooks/useProntuarios';

export function ProntuariosContainer() {
  const { records, searchQuery, setSearchQuery } = useProntuarios();
  const router = useRouter();

  const formattedRecords: RecordCardData[] = useMemo(() => {
    return records.map((r) => ({
      id: r.id,
      petName: r.petName,
      species: 'paw',
      description: r.notes || r.title,
      badges: [r.type],
      date: r.date,
      synced: r.isSynced,
    }));
  }, [records]);

  const handleAddPress = () => {
    router.navigate('/(tabs)/prontuarios/newProntuarioScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Prontuários" />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <SortFilterBar onSortPress={() => {}} onFilterPress={() => {}} />

      <FlatList
        data={formattedRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordCard data={item} onPress={() => {}} />
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
