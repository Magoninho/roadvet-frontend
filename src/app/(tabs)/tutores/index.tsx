import { useAuth } from '@/contexts/AuthContext';
import { useObservable } from '@/database/hooks/useObservable';
import Tutor from '@/database/models/Tutor';
import { observeTutores } from '@/database/repositories/tutores';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import { OwnerCard, OwnerCardData } from '../../components/OwnerCard';
import { SearchBar } from '../../components/SearchBar';
import { ViewSortFilterBar } from '../../components/ViewSortFilterBar';

const NUM_COLUMNS = 3; 

type ListItem = { id: string; tutor: Tutor } | { id: string; empty: true }; 

function fillWithEmptyItems(tutores: Tutor[]): ListItem[] { 
  const data: ListItem[] = tutores.map((tutor) => ({ id: tutor.id, tutor })); 
  const remainder = data.length % NUM_COLUMNS; 
  if (remainder === 0) return data; 

  const emptyItemsCount = NUM_COLUMNS - remainder; 
  const emptyItems: ListItem[] = Array.from({ length: emptyItemsCount }).map( 
    (_, index) => ({ id: `empty-${index}`, empty: true }) 
  ); 

  return [...data, ...emptyItems]; 
} 

function OwnerCardContainer({ tutor, onPress }: { tutor: Tutor; onPress: (id: string) => void }) { 
  const pets = useObservable(() => tutor.pets.observe(), [tutor.id], []); 

  const data: OwnerCardData = { 
    id: tutor.id, 
    name: tutor.nomeCompleto, 
    pets: pets.map((pet) => pet.nome), 
    photoUrl: tutor.avatarUrl ?? undefined, 
  }; 

  return <OwnerCard data={data} onPress={onPress} />; 
} 

export default function TutoresScreen() { 
  const { veterinario } = useAuth(); 

  console.log('--- DADOS BRUTOS DO VETERINARIO ---', veterinario?._raw);
  console.log('--- CHAVES DO OBJETO ---', Object.keys(veterinario || {}));
  const [search, setSearch] = useState(''); 
  const router = useRouter(); 

  // Pega o ID correto vindo do veterinario retornado pelo AuthContext
  const vetId = veterinario?.id ?? null;
  console.log('--- [DEBUG SCREEN] VETERINÁRIO LOGADO ID ---', vetId, typeof vetId); 

  const tutores = useObservable(
  () => observeTutores(),
  [search],
  [],
  );


  console.log('--- [DEBUG SCREEN] TUTORES ENCONTRADOS NO OBSERVABLE ---', tutores.length, tutores); 

  const listData = useMemo(() => fillWithEmptyItems(tutores), [tutores]); 

  const handleView = () => {}; 
  const handleSort = () => {}; 
  const handleFilter = () => {}; 
  const handleCardPress = (id: string) => { 
    router.push({ 
      params: { id }, 
      pathname: '/(modals)/tutores/details' 
    }); 
  }; 
  const handleAddPress = () => { 
    router.push('/(modals)/tutores/new'); 
  }; 

  return ( 
    <SafeAreaView style={styles.container}> 
      <Header title="Tutores" syncStatus="synced" /> 
      <SearchBar value={search} onChangeText={setSearch} /> 
      <ViewSortFilterBar 
        onViewPress={handleView} 
        onSortPress={handleSort} 
        onFilterPress={handleFilter} 
      /> 

      <FlatList 
        data={listData} 
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => 
          'empty' in item ? ( 
            <View style={styles.emptyCard} /> 
          ) : ( 
            <OwnerCardContainer tutor={item.tutor} onPress={handleCardPress} /> 
          ) 
        } 
        numColumns={NUM_COLUMNS} 
        contentContainerStyle={styles.listContent} 
        columnWrapperStyle={styles.row} 
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
    paddingHorizontal: 10, 
    paddingBottom: 100, 
    paddingTop: 10 
  }, 
  row: { 
    justifyContent: 'flex-start', 
  }, 
  emptyCard: { 
    width: '31%', 
    marginHorizontal: '1.16%', 
  }, 
});