import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import Tutor from '@/database/models/Tutor';
import { deleteTutor, observeTutor, updateTutor } from '@/database/repositories/tutores';
import { observePetsByTutor } from '@/database/repositories/pets';
import { useObservable } from '@/database/hooks/useObservable';
import { formatAge } from '@/utils/format';
import { DetailTopBar } from '../../components/DetailTopBar';
import { EditableAvatar } from '../../components/EditableAvatar';
import { FormFooter } from '../../components/FormFooter';
import { InfoText } from '../../components/InfoText';
import { LabeledInput } from '../../components/LabeledInput';
import { PetSummaryCard, PetSummaryData } from '../../components/PetSummaryCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SectionDivider } from '../../components/SectionDivider';
import * as DocumentPicker from 'expo-document-picker';
import { persistAttachmentFile } from '@/database/repositories/attachments';
import { convertToDataUri } from '@/utils/image';
import { PetFormModal } from '../../components/PetFormModal';

export function TutorDetalheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const tutor = useObservable<Tutor | null>(() => (id ? observeTutor(id) : of(null)), [id], null);
  const pets = useObservable(() => (id ? observePetsByTutor(id) : of([])), [id], []);

  const [editMode, setEditMode] = useState(false);
  const [modalPetVisible, setModalPetVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');

  if (!tutor) {
    return <SafeAreaView style={styles.container} />;
  }

  const handleBack = () => {
    if (editMode) {
      handleCancelEdit();
      return;
    }
    router.back();
  };

  const handleEnableEdit = () => {
    setNome(tutor.nomeCompleto);
    setEndereco(tutor.endereco ?? '');
    setTelefone(tutor.telefone1 ?? '');
    setCpf(tutor.cpf);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await updateTutor(tutor, {
        nomeCompleto: nome.trim(),
        endereco: endereco.trim() || null,
        telefone1: telefone.trim() || null,
        cpf: cpf.trim(),
      });
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Excluir tutor', `Tem certeza que deseja excluir ${tutor.nomeCompleto}? Todos os pets e prontuários vinculados também serão excluídos.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteTutor(tutor);
          router.back();
        },
      },
    ]);
  };

  const handlePetPress = (petId: string) => {
    router.push({ pathname: '/(modals)/pets/details', params: { petId } });
  };

  const handleNewPet = () => setModalPetVisible(true);

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
      await updateTutor(tutor, { avatarUrl: dataUri });
    } catch (error) {
      console.warn('Erro ao atualizar foto do tutor:', error);
    }
  };

  const handleSaveNewPet = () => {
    setModalPetVisible(false);
  };

  const petSummaries: PetSummaryData[] = pets.map((pet) => ({
    id: pet.id,
    name: pet.nome,
    age: formatAge(pet.dataNascimento),
    breed: pet.raca,
    species: pet.especie?.toLowerCase().startsWith('fel') ? 'cat' : 'dog',
  }));

  return (
    <SafeAreaView style={styles.container}>
      <DetailTopBar
        onBackPress={handleBack}
        onEditPress={editMode ? undefined : handleEnableEdit}
        onDeletePress={editMode ? undefined : handleDelete}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <EditableAvatar
          photoUrl={tutor.avatarUrl ?? undefined}
          editable={true}
          onPress={handleChangePhoto}
        />

        {editMode ? (
          <LabeledInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.nameInput}
          />
        ) : (
          <Text style={styles.name}>{tutor.nomeCompleto}</Text>
        )}

        <SectionDivider icon="information" label="Informações básicas" />
        {editMode ? (
          <>
            <LabeledInput
              placeholder="Endereço"
              value={endereco}
              onChangeText={setEndereco}
              style={styles.fullInput}
            />
            <LabeledInput
              placeholder="Telefone"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="numeric"
              style={styles.fullInput}
            />
            <LabeledInput
              placeholder="CPF"
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
              style={styles.fullInput}
            />
          </>
        ) : (
          <>
            <InfoText label="Endereço" value={tutor.endereco ?? ''} />
            <InfoText label="Telefone" value={tutor.telefone1 ?? ''} />
            <InfoText label="CPF" value={tutor.cpf} />
          </>
        )}

        <SectionDivider icon="paw" label="Pets" />
        {!editMode && <PrimaryButton label="Novo pet" onPress={handleNewPet} />}

        {petSummaries.map((pet) => (
          <PetSummaryCard key={pet.id} data={pet} onPress={handlePetPress} />
        ))}
      </ScrollView>

      {editMode && <FormFooter onCancel={handleCancelEdit} onSave={handleSaveEdit} saving={saving} />}

      <PetFormModal
        visible={modalPetVisible}
        onCancel={() => setModalPetVisible(false)}
        onSave={handleSaveNewPet}
        tutorName={tutor.nomeCompleto}
        tutorId={tutor.id}
        showTutorSection={false}
      />
    </SafeAreaView>
  );
}

export default TutorDetalheScreen;

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
  fullInput: {
    marginHorizontal: 16,
    marginTop: 12,
  },
});
