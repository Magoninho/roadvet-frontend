import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import Tutor from '@/database/models/Tutor';
import { deleteAvatarFile, persistAvatarFile } from '@/database/repositories/avatars';
import { deleteTutor, getTutorDeletionImpact, observeTutor, updateTutor } from '@/database/repositories/tutores';
import { observePetsByTutor } from '@/database/repositories/pets';
import { useObservable } from '@/database/hooks/useObservable';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { deletionWarnings } from '@/utils/deletion';
import { formatAge, formatDateBR } from '@/utils/format';
import { pickAvatarImage } from '@/utils/pickAvatarImage';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { DateInput } from '../../components/DateInput';
import { DetailTopBar } from '../../components/DetailTopBar';
import { EditableAvatar } from '../../components/EditableAvatar';
import { FormField } from '../../components/FormField';
import { FormFooter } from '../../components/FormFooter';
import { FormRow } from '../../components/FormRow';
import { InfoText } from '../../components/InfoText';
import { LabeledInput } from '../../components/LabeledInput';
import { PetSummaryCard, PetSummaryData } from '../../components/PetSummaryCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SectionDivider } from '../../components/SectionDivider';
import { PetFormModal } from '../../components/PetFormModal';
import { COLORS, SPACING } from '@/theme';

export function TutorDetalheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const tutor = useObservable<Tutor | null>(() => (id ? observeTutor(id) : of(null)), [id], null);
  const pets = useObservable(() => (id ? observePetsByTutor(id) : of([])), [id], []);

  const [editMode, setEditMode] = useState(false);
  const [modalPetVisible, setModalPetVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);

  const deletion = useDeleteConfirmation({
    measure: () => getTutorDeletionImpact(tutor!),
    remove: () => deleteTutor(tutor!),
    onDeleted: () => (router.canGoBack() ? router.back() : router.replace('/(tabs)/tutores')),
  });

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
    setCpf(tutor.cpf);
    setDataNascimento(tutor.dataNascimento);
    setEmail(tutor.email ?? '');
    setCep(tutor.cep ?? '');
    setEndereco(tutor.endereco ?? '');
    setNumero(tutor.numero ?? '');
    setBairro(tutor.bairro ?? '');
    setComplemento(tutor.complemento ?? '');
    setCidade(tutor.cidade ?? '');
    setUf(tutor.uf ?? '');
    setTelefone1(tutor.telefone1 ?? '');
    setTelefone2(tutor.telefone2 ?? '');
    setAvatarUri(null);
    setAvatarFileName(null);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleSaveEdit = async () => {
    if (!nome.trim() || !cpf.trim() || !cep.trim() || !endereco.trim() || !numero.trim() || !bairro.trim() || !cidade.trim() || !uf.trim() || !telefone1.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *.');
      return;
    }

    setSaving(true);
    try {
      const previousAvatarUrl = tutor.avatarUrl;
      const avatarUrl = avatarUri ? await persistAvatarFile(avatarUri, avatarFileName!) : undefined;

      await updateTutor(tutor, {
        nomeCompleto: nome.trim(),
        cpf: cpf.trim(),
        dataNascimento,
        email: email.trim() || null,
        cep: cep.trim(),
        endereco: endereco.trim(),
        numero: numero.trim(),
        bairro: bairro.trim(),
        complemento: complemento.trim() || null,
        cidade: cidade.trim(),
        uf: uf.trim().toUpperCase(),
        telefone1: telefone1.trim(),
        telefone2: telefone2.trim() || null,
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

  const handlePetPress = (petId: string) => {
    router.push({ pathname: '/(modals)/pets/details', params: { petId } });
  };

  const handleNewPet = () => setModalPetVisible(true);

  const handleChangePhoto = async () => {
    const picked = await pickAvatarImage();
    if (!picked) return;
    setAvatarUri(picked.uri);
    setAvatarFileName(picked.fileName);
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
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <DetailTopBar
        onBackPress={handleBack}
        onEditPress={editMode ? undefined : handleEnableEdit}
        onDeletePress={editMode ? undefined : deletion.open}
      >
        <EditableAvatar
          photoUrl={avatarUri ?? tutor.avatarUrl ?? undefined}
          editable={editMode}
          onPress={handleChangePhoto}
          size={72}
          tone="onBrand"
          style={styles.avatar}
        />

        {editMode ? (
          <LabeledInput
            label="Nome completo*"
            labelTone="onBrand"
            placeholder="Nome completo do tutor"
            value={nome}
            onChangeText={setNome}
            containerStyle={styles.nameInput}
          />
        ) : (
          <Text style={styles.name}>{tutor.nomeCompleto}</Text>
        )}
      </DetailTopBar>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SectionDivider icon="information-outline" label="Informações básicas" showLine={false} />
        {editMode ? (
          <>
            <FormRow style={styles.formRowMargin}>
              <LabeledInput
                label="CPF*"
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
                containerStyle={styles.flexInput}
              />
              <FormField label="Data de nascimento" style={styles.flexInput}>
                <DateInput value={dataNascimento} onChange={setDataNascimento} placeholder="DD/MM/AAAA" />
              </FormField>
            </FormRow>

            <LabeledInput
              label="Email"
              placeholder="nome@exemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.fullInput}
            />
            <LabeledInput label="CEP*" placeholder="00000-000" value={cep} onChangeText={setCep} keyboardType="numeric" containerStyle={styles.fullInput} />

            <FormRow style={styles.formRowMargin}>
              <LabeledInput label="Endereço*" placeholder="Rua, avenida..." value={endereco} onChangeText={setEndereco} containerStyle={styles.flexInputLarge} />
              <LabeledInput label="Número*" placeholder="Nº" value={numero} onChangeText={setNumero} keyboardType="numeric" containerStyle={styles.flexInputSmall} />
            </FormRow>

            <FormRow style={styles.formRowMargin}>
              <LabeledInput label="Bairro*" placeholder="Ex.: Centro" value={bairro} onChangeText={setBairro} containerStyle={styles.flexInput} />
              <LabeledInput label="Complemento" placeholder="Apto, bloco..." value={complemento} onChangeText={setComplemento} containerStyle={styles.flexInput} />
            </FormRow>

            <FormRow style={styles.formRowMargin}>
              <LabeledInput label="Cidade*" placeholder="Ex.: Fortaleza" value={cidade} onChangeText={setCidade} containerStyle={styles.flexInputLarge} />
              <LabeledInput label="UF*" placeholder="CE" value={uf} onChangeText={setUf} autoCapitalize="characters" containerStyle={styles.flexInputSmall} />
            </FormRow>

            <FormRow style={styles.formRowMargin}>
              <LabeledInput label="Telefone 1*" placeholder="(85) 99999-9999" value={telefone1} onChangeText={setTelefone1} keyboardType="numeric" containerStyle={styles.flexInput} />
              <LabeledInput label="Telefone 2" placeholder="(85) 99999-9999" value={telefone2} onChangeText={setTelefone2} keyboardType="numeric" containerStyle={styles.flexInput} />
            </FormRow>
          </>
        ) : (
          <>
            <InfoText label="CPF" value={tutor.cpf} />
            <InfoText label="Data de nascimento" value={formatDateBR(tutor.dataNascimento)} />
            {!!tutor.email && <InfoText label="Email" value={tutor.email} />}
            <InfoText label="Endereço" value={tutor.endereco ?? ''} />
            {!!tutor.numero && <InfoText label="Número" value={tutor.numero} />}
            {!!tutor.complemento && <InfoText label="Complemento" value={tutor.complemento} />}
            <InfoText label="Bairro" value={tutor.bairro ?? ''} />
            <InfoText label="Cidade" value={tutor.cidade ?? ''} />
            <InfoText label="UF" value={tutor.uf ?? ''} />
            <InfoText label="CEP" value={tutor.cep ?? ''} />
            <InfoText label="Telefone" value={tutor.telefone1 ?? ''} />
            {!!tutor.telefone2 && <InfoText label="Telefone 2" value={tutor.telefone2} />}
          </>
        )}

        <SectionDivider icon="paw-outline" label="Pets" />
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

      <ConfirmDialog
        visible={deletion.visible}
        title="Excluir tutor"
        message={`Tem certeza que deseja excluir ${tutor.nomeCompleto}? Excluir um tutor também exclui todos os pets vinculados a ele e todos os prontuários desses pets.`}
        warnings={deletionWarnings(deletion.impact, pets.map((pet) => pet.nome))}
        loading={deletion.deleting}
        error={deletion.error}
        onConfirm={deletion.confirm}
        onCancel={deletion.cancel}
      />
    </SafeAreaView>
  );
}

export default TutorDetalheScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: SPACING.block,
  },
  avatar: {
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onBrand,
    marginTop: 16,
  },
  nameInput: {
    marginTop: 16,
  },
  fullInput: {
    marginHorizontal: SPACING.gutter,
    marginTop: 12,
  },
  formRowMargin: {
    marginHorizontal: SPACING.gutter,
    marginTop: 12,
    marginBottom: 0,
  },
  flexInput: { flex: 1, minWidth: 0, flexShrink: 1 },
  flexInputLarge: { flex: 2, minWidth: 0, flexShrink: 1 },
  flexInputSmall: { flex: 1, minWidth: 0, flexShrink: 1 },
});
