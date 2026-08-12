import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DetailTopBar } from '../../components/DetailTopBar';
import { EditableAvatar } from '../../components/EditableAvatar';
import { FormFooter } from '../../components/FormFooter';
import { InfoText } from '../../components/InfoText';
import { LabeledInput } from '../../components/LabeledInput';
import { PetSummaryCard, PetSummaryData } from '../../components/PetSummaryCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SectionDivider } from '../../components/SectionDivider';

const MOCK_TUTOR = {
  id: '1',
  name: 'Magali',
  address: 'Rua do Limoeiro, 67',
  phone: '(85) 9 9574-8673',
  cpf: '713.927.970-55',
  photoUrl:
    'https://static.wikia.nocookie.net/monica/images/8/89/Magali_e_Mingau_se_abra%C3%A7ando.png/revision/latest?cb=20221221004720&path-prefix=pt-br',
};

const MOCK_PETS: PetSummaryData[] = [
  { id: '1', name: 'Mingau', age: '6 anos', gender: 'Macho', breed: 'SRD', species: 'cat' },
  { id: '2', name: 'Leo', age: '8 anos', gender: 'Macho', breed: 'SRD', species: 'cat' },
];

export function TutorDetalheScreen() {
  const router = useRouter();
  const { tutorId } = useLocalSearchParams<{ tutorId: string }>();

  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState(MOCK_TUTOR.name);
  const [address, setAddress] = useState(MOCK_TUTOR.address);
  const [phone, setPhone] = useState(MOCK_TUTOR.phone);
  const [cpf, setCpf] = useState(MOCK_TUTOR.cpf);
  const [photoUrl, setPhotoUrl] = useState(MOCK_TUTOR.photoUrl);

  const handleBack = () => {
    if (editMode) {
      handleCancelEdit();
      return;
    }
    router.back();
  };

  const handleEnableEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setName(MOCK_TUTOR.name);
    setAddress(MOCK_TUTOR.address);
    setPhone(MOCK_TUTOR.phone);
    setCpf(MOCK_TUTOR.cpf);
    setPhotoUrl(MOCK_TUTOR.photoUrl);
    setEditMode(false);
  };

  const handleSaveEdit = () => {
    // salvar alterações do tutor: name, address, phone, cpf, photoUrl
    setEditMode(false);
  };

  const handleDelete = () => {
    // confirmar e excluir tutor
  };

  const handlePetPress = (id: string) => {
    // navegar para detalhe do pet
  };

  const handleNewPet = () => {
    router.push('/(modals)/pets/new');
  };

  const handleChangePhoto = () => {
    // abrir seletor de imagem (expo-image-picker) e atualizar photoUrl
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
          photoUrl={photoUrl}
          editable={editMode}
          onPress={handleChangePhoto}
        />

        {editMode ? (
          <LabeledInput
            placeholder="Nome"
            value={name}
            onChangeText={setName}
            style={styles.nameInput}
          />
        ) : (
          <Text style={styles.name}>{name}</Text>
        )}

        <SectionDivider icon="information" label="Informações básicas" />
        {editMode ? (
          <>
            <LabeledInput
              placeholder="Endereço"
              value={address}
              onChangeText={setAddress}
              style={styles.fullInput}
            />
            <LabeledInput
              placeholder="Telefone"
              value={phone}
              onChangeText={setPhone}
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
            <InfoText label="Endereço" value={address} />
            <InfoText label="Telefone" value={phone} />
            <InfoText label="CPF" value={cpf} />
          </>
        )}

        <SectionDivider icon="paw" label="Pets" />
        {!editMode && <PrimaryButton label="Novo pet" onPress={handleNewPet} />}
        {MOCK_PETS.map((pet) => (
          <PetSummaryCard key={pet.id} data={pet} onPress={handlePetPress} />
        ))}
      </ScrollView>

      {editMode && <FormFooter onCancel={handleCancelEdit} onSave={handleSaveEdit} />}
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