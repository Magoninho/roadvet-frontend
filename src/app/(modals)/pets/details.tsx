import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import Pet from '@/database/models/Pet';
import Tutor from '@/database/models/Tutor';
import { deletePet, observePet, updatePet } from '@/database/repositories/pets';
import { observeProntuariosByPet } from '@/database/repositories/prontuarios';
import { useObservable } from '@/database/hooks/useObservable';
import { formatAge, formatDateBR, speciesToIcon } from '@/utils/format';
import { BulletList } from '../../components/BulletList';
import { DetailTopBar } from '../../components/DetailTopBar';
import { OwnerReference } from '../../components/OwnerReference';
import { EditableAvatar } from '../../components/EditableAvatar';
import { RecordCard, RecordCardData } from '../../components/RecordCard';
import { SectionDivider } from '../../components/SectionDivider';
import { LabeledInput } from '../../components/LabeledInput';
import { DateInput } from '../../components/DateInput';
import { WeightInput } from '../../components/WeightInput';
import { SelectInput } from '../../components/SelectInput';
import { FormFooter } from '../../components/FormFooter';
import { FormRow } from '../../components/FormRow';
import * as DocumentPicker from 'expo-document-picker';
import { persistAttachmentFile } from '@/database/repositories/attachments';
import { convertToDataUri } from '@/utils/image';

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
      await updatePet(pet, {
        nome: nome.trim(),
        dataNascimento,
        peso: peso.trim() || null,
        especie,
        raca: raca.trim() || null,
      });
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePhoto = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const asset = result.assets[0];
      const savedUri = await persistAttachmentFile(asset.uri, asset.name || 'avatar.jpg');
      const dataUri = await convertToDataUri(savedUri, asset.mimeType);
      await updatePet(pet, { avatarUrl: dataUri });
    } catch (error) {
      console.warn('Erro ao atualizar foto do pet:', error);
    }
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
      <DetailTopBar
        onBackPress={handleBack}
        onEditPress={editMode ? undefined : handleEnableEdit}
        onDeletePress={editMode ? undefined : handleDelete}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <EditableAvatar
          photoUrl={pet.avatarUrl ?? undefined}
          fallbackIcon={species}
          editable={true}
          onPress={handleChangePhoto}
        />

        {editMode ? (
          <LabeledInput
            placeholder="Nome do pet"
            value={nome}
            onChangeText={setNome}
            style={styles.nameInput}
          />
        ) : (
          <Text style={styles.name}>{pet.nome}</Text>
        )}

        {tutor && <OwnerReference ownerName={tutor.nomeCompleto} />}

        <SectionDivider icon="information" label="Informações básicas" />

        {editMode ? (
          <View style={styles.editSection}>
            <FormRow>
              <DateInput
                value={dataNascimento}
                onChange={setDataNascimento}
                style={styles.flexInput}
              />
              <WeightInput
                value={peso}
                onChangeText={setPeso}
                style={styles.flexInput}
              />
            </FormRow>
            <FormRow>
              <SelectInput
                value={especie}
                onSelect={setEspecie}
                options={ESPECIES}
                placeholder="Espécie"
                style={styles.flexInput}
              />
              <LabeledInput
                placeholder="Raça"
                value={raca}
                onChangeText={setRaca}
                style={styles.flexInput}
              />
            </FormRow>
          </View>
        ) : (
          <BulletList items={infoItems} />
        )}

        <SectionDivider icon="script-text-outline" label="Prontuários" />
        {records.map((record) => (
          <RecordCard key={record.id} data={record} onPress={handleRecordPress} />
        ))}
      </ScrollView>

      {editMode && (
        <FormFooter onCancel={handleCancelEdit} onSave={handleSaveEdit} saving={saving} />
      )}
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
  editSection: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  flexInput: {
    flex: 1,
  },
});

