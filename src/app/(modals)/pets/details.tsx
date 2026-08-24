import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import Pet from '@/database/models/Pet';
import Tutor from '@/database/models/Tutor';
import { deletePet, observePet } from '@/database/repositories/pets';
import { observeProntuariosByPet } from '@/database/repositories/prontuarios';
import { useObservable } from '@/database/hooks/useObservable';
import { formatAge, formatDateBR, speciesToIcon } from '@/utils/format';
import { BulletList } from '../../components/BulletList';
import { DetailTopBar } from '../../components/DetailTopBar';
import { OwnerReference } from '../../components/OwnerReference';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { RecordCard, RecordCardData } from '../../components/RecordCard';
import { SectionDivider } from '../../components/SectionDivider';

export function PetDetalheScreen() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();

  const pet = useObservable<Pet | null>(() => (petId ? observePet(petId) : of(null)), [petId], null);
  const prontuarios = useObservable(
    () => (petId ? observeProntuariosByPet(petId) : of([])),
    [petId],
    [],
  );
  const tutor = useObservable<Tutor | null>(() => (pet ? pet.tutor.observe() : of(null)), [pet], null);

  if (!pet) {
    return <SafeAreaView style={styles.container} />;
  }

  const species = speciesToIcon(pet.especie);
  const infoItems = [
    `Data Nasc.: ${formatDateBR(pet.dataNascimento)} (${formatAge(pet.dataNascimento)})`,
    pet.raca ?? undefined,
    pet.especie,
    pet.peso ? `${pet.peso} kg` : undefined,
  ].filter(Boolean) as string[];

  const records: RecordCardData[] = prontuarios.map((prontuario) => {
    const badges: RecordCardData['badges'] = [];
    if (prontuario.prescription) badges.push('medication');
    if (prontuario.examRequestNotes) badges.push('exam');

    return {
      id: prontuario.id,
      petName: pet.nome,
      species,
      description: prontuario.anamnesis || prontuario.physicalExam || 'Consulta registrada',
      badges,
      date: formatDateBR(prontuario.date),
      synced: true,
    };
  });

  const handleBack = () => router.back();
  const handleEdit = () => {
    // A edição é feita diretamente pelo formulário de novo prontuário; sem edição de dados fixos do pet por ora.
  };
  const handleDelete = () => {
    Alert.alert('Excluir pet', `Tem certeza que deseja excluir ${pet.nome}? Todos os prontuários vinculados também serão excluídos.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deletePet(pet);
          router.back();
        },
      },
    ]);
  };
  const handleRecordPress = (id: string) => {
    router.push({ pathname: '/(modals)/prontuarios/details', params: { prontuarioId: id } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <DetailTopBar onBackPress={handleBack} onEditPress={handleEdit} onDeletePress={handleDelete} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ProfileAvatar photoUrl={pet.avatarUrl ?? undefined} fallbackIcon={species} />
        <Text style={styles.name}>{pet.nome}</Text>
        {tutor && <OwnerReference ownerName={tutor.nomeCompleto} />}

        <SectionDivider icon="information" label="Informações básicas" />
        <BulletList items={infoItems} />

        <SectionDivider icon="script-text-outline" label="Prontuários" />
        {records.map((record) => (
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
