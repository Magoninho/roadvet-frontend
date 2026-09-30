import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import Pet from '@/database/models/Pet';
import Tutor from '@/database/models/Tutor';
import { deleteAvatarFile, persistAvatarFile } from '@/database/repositories/avatars';
import { deletePet, getPetDeletionImpact, observePet, updatePet } from '@/database/repositories/pets';
import { observeProntuariosByPet } from '@/database/repositories/prontuarios';
import { useObservable } from '@/database/hooks/useObservable';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { deletionWarnings } from '@/utils/deletion';
import { formatAge, formatDateBR, speciesToIcon } from '@/utils/format';
import { pickAvatarImage } from '@/utils/pickAvatarImage';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { DateInput } from '../../components/DateInput';
import { DetailTopBar } from '../../components/DetailTopBar';
import { EditableAvatar } from '../../components/EditableAvatar';
import { FormFooter } from '../../components/FormFooter';
import { InfoText } from '../../components/InfoText';
import { LabeledInput } from '../../components/LabeledInput';
import { OwnerReference } from '../../components/OwnerReference';
import { RecordCard, RecordCardData } from '../../components/RecordCard';
import { SectionDivider } from '../../components/SectionDivider';
import { SelectInput } from '../../components/SelectInput';
import { WeightInput } from '../../components/WeightInput';

const ESPECIES = ['Canino', 'Felino'];

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

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [peso, setPeso] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);

  const deletion = useDeleteConfirmation({
    measure: () => getPetDeletionImpact(pet!),
    remove: () => deletePet(pet!),
    onDeleted: () => (router.canGoBack() ? router.back() : router.replace('/(tabs)/pets')),
  });

  if (!pet) {
    return <SafeAreaView style={styles.container} />;
  }

  const species = speciesToIcon(pet.especie);

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

  const handleBack = () => {
    if (editMode) {
      handleCancelEdit();
      return;
    }
    router.back();
  };

  const handleEnableEdit = () => {
    setNome(pet.nome);
    setDataNascimento(pet.dataNascimento);
    setPeso(pet.peso ?? '');
    setEspecie(pet.especie);
    setRaca(pet.raca ?? '');
    setAvatarUri(null);
    setAvatarFileName(null);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleSaveEdit = async () => {
    if (!nome.trim() || !especie) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome e a espécie do pet.');
      return;
    }

    setSaving(true);
    try {
      const previousAvatarUrl = pet.avatarUrl;
      const avatarUrl = avatarUri ? await persistAvatarFile(avatarUri, avatarFileName!) : undefined;

      await updatePet(pet, {
        nome: nome.trim(),
        dataNascimento,
        peso: peso.trim() || null,
        especie,
        raca: raca.trim() || null,
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      });

      if (avatarUrl !== undefined && previousAvatarUrl && previousAvatarUrl !== avatarUrl) {
        await deleteAvatarFile(previousAvatarUrl);
      }

      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePhoto = async () => {
    const picked = await pickAvatarImage();
    if (!picked) return;
    setAvatarUri(picked.uri);
    setAvatarFileName(picked.fileName);
  };

  const handleRecordPress = (id: string) => {
    router.push({ pathname: '/(modals)/prontuarios/details', params: { prontuarioId: id } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <DetailTopBar
        onBackPress={handleBack}
        onEditPress={editMode ? undefined : handleEnableEdit}
        onDeletePress={editMode ? undefined : deletion.open}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <EditableAvatar
          photoUrl={avatarUri ?? pet.avatarUrl ?? undefined}
          fallbackIcon={species}
          editable={editMode}
          onPress={handleChangePhoto}
        />

        {editMode ? (
          <LabeledInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.nameInput} />
        ) : (
          <Text style={styles.name}>{pet.nome}</Text>
        )}

        {tutor && <OwnerReference ownerName={tutor.nomeCompleto} />}

        <SectionDivider icon="information" label="Informações básicas" />
        {editMode ? (
          <>
            <View style={styles.row}>
              <DateInput value={dataNascimento} onChange={setDataNascimento} style={styles.rowInputLeft} />
              <WeightInput value={peso} onChangeText={setPeso} style={styles.rowInputRight} />
            </View>

            <View style={styles.row}>
              <SelectInput
                value={especie}
                onSelect={setEspecie}
                options={ESPECIES}
                placeholder="Espécie*"
                style={styles.rowInputLeft}
              />
              <LabeledInput placeholder="Raça" value={raca} onChangeText={setRaca} style={styles.rowInputRight} />
            </View>
          </>
        ) : (
          <>
            <InfoText label="Espécie" value={pet.especie} />
            <InfoText label="Raça" value={pet.raca ?? ''} />
            <InfoText label="Data de nascimento" value={formatDateBR(pet.dataNascimento)} />
            <InfoText label="Idade" value={formatAge(pet.dataNascimento)} />
            {!!pet.peso && <InfoText label="Peso" value={`${pet.peso} kg`} />}
          </>
        )}

        <SectionDivider icon="script-text-outline" label="Prontuários" />
        {records.map((record) => (
          <RecordCard key={record.id} data={record} onPress={handleRecordPress} />
        ))}
      </ScrollView>

      {editMode && <FormFooter onCancel={handleCancelEdit} onSave={handleSaveEdit} saving={saving} />}

      <ConfirmDialog
        visible={deletion.visible}
        title="Excluir pet"
        message={`Tem certeza que deseja excluir ${pet.nome}? Excluir um pet também exclui todos os prontuários dele, incluindo os anexos de exames.`}
        warnings={deletionWarnings(deletion.impact)}
        loading={deletion.deleting}
        error={deletion.error}
        onConfirm={deletion.confirm}
        onCancel={deletion.cancel}
      />
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
  nameInput: {
    marginHorizontal: 16,
    marginTop: 14,
    textAlign: 'center',
  },
  row: { flexDirection: 'row', marginHorizontal: 16, marginTop: 12, gap: 12, alignItems: 'flex-start' },
  rowInputLeft: { flex: 1 },
  rowInputRight: { flex: 1 },
});
