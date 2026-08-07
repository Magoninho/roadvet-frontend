import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, SafeAreaView, View } from 'react-native';
import {
  Header,
  SearchBar,
  ViewSortFilterBar,
  FloatingActionButton,
} from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { OwnerCard, OwnerCardData } from '../components/OwnerCard';
import { TutorFormModal } from '../components/TutorFormModal';
import { useTutores } from '../hooks/useTutores';

const NUM_COLUMNS = 3;

type ListItem = OwnerCardData | { id: string; empty: true };

function fillWithEmptyItems(data: OwnerCardData[]): ListItem[] {
  const remainder = data.length % NUM_COLUMNS;
  if (remainder === 0) return data;

  const emptyItemsCount = NUM_COLUMNS - remainder;
  const emptyItems: ListItem[] = Array.from({ length: emptyItemsCount }).map(
    (_, index) => ({ id: `empty-${index}`, empty: true })
  );

  return [...data, ...emptyItems];
}

export function TutoresContainer() {
  const { tutores, searchQuery, setSearchQuery, addTutor } = useTutores();
  const [modalVisible, setModalVisible] = useState(false);

  const cardData: OwnerCardData[] = useMemo(() => {
    return tutores.map((t) => ({
      id: t.id,
      name: t.name,
      pets: [],
    }));
  }, [tutores]);

  const listData = useMemo(() => fillWithEmptyItems(cardData), [cardData]);

  const handleSaveTutor = async (data: { name: string; phone: string }) => {
    await addTutor(data);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Tutores" syncStatus="synced" />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <ViewSortFilterBar
        onViewPress={() => {}}
        onSortPress={() => {}}
        onFilterPress={() => {}}
      />

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          'empty' in item ? (
            <View style={styles.emptyCard} />
          ) : (
            <OwnerCard data={item} onPress={() => {}} />
          )
        }
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />

      <FloatingActionButton onPress={() => setModalVisible(true)} />

      <TutorFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSaveTutor}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 100,
    paddingTop: spacing.md,
  },
  row: {
    justifyContent: 'flex-start',
  },
  emptyCard: {
    width: '31%',
    marginHorizontal: '1.16%',
  },
});
