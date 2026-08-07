import React from 'react';
import { ScrollView, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Header } from '../../components/Header';
import { DetailTopBar } from '../../components/DetailTopBar';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { OwnerReference } from '../../components/OwnerReference';
import { SectionDivider } from '../../components/SectionDivider';
import { BulletList } from '../../components/BulletList';
import { RecordCard, RecordCardData } from '../../components/RecordCard';

const MOCK_PET = {
  id: '1',
  name: 'Mingau',
  age: '6 anos',
  gender: 'Macho',
  breed: 'Angorá',
  birthDate: '12/07/2020',
  ownerName: 'Magali',
  species: 'cat',
  synced: true,
  photoUrl: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fmonica%2Fimages%2F5%2F5a%2FMingau_%2528foto_promocional%2529.jpg%2Frevision%2Flatest%3Fcb%3D20180728012816%26path-prefix%3Dpt-br&cx=400'
};

const MOCK_RECORDS: RecordCardData[] = [
  {
    id: '1',
    petName: 'Mingau',
    description: 'Tomou dose de vacina polivalente e foram solicitados exames...',
    badges: ['medication', 'exam'],
    date: '22/04/2026',
    synced: false,
    species: 'cat'
  },
  {
    id: '2',
    petName: 'Mingau',
    description: 'Consulta de rotina...',
    badges: ['exam'],
    date: '15/03/2026',
    synced: true,
    species: 'cat'
  },
];

export function PetDetalheScreen() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();

  const infoItems = [
    `Data Nasc.: ${MOCK_PET.birthDate} (${MOCK_PET.age})`,
    MOCK_PET.gender,
    MOCK_PET.breed,
    MOCK_PET.species === 'cat' ? 'Felino' : 'Canino',
  ];

  const handleBack = () => router.back();
  const handleEdit = () => {
    // navegar para edição do pet
  };
  const handleDelete = () => {
    // confirmar e excluir pet
  };
  const handleRecordPress = (id: string) => {
    // navegar para detalhe do prontuário
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Pets" syncStatus="synced" />
      <DetailTopBar onBackPress={handleBack} onEditPress={handleEdit} onDeletePress={handleDelete} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ProfileAvatar photoUrl={MOCK_PET.photoUrl} fallbackIcon="cat" />
        <Text style={styles.name}>{MOCK_PET.name}</Text>
        <OwnerReference ownerName={MOCK_PET.ownerName} />

        <SectionDivider icon="information" label="Informações básicas" />
        <BulletList items={infoItems} />

        <SectionDivider icon="script-text-outline" label="Prontuários" />
        {MOCK_RECORDS.map((record) => (
          <RecordCard key={record.id} data={record} onPress={handleRecordPress} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default PetDetalheScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 14,
  },
});