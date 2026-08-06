import React, { useState } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { BackHeader } from '../../components/BackHeader';
import { AvatarPicker } from '../../components/AvatarPicker';
import { TutorAutocomplete } from '../../components/TutorAutocomplete';
import { GhostButton } from '../../components/GhostButton';
import { LabeledInput } from '../../components/LabeledInput';
import { DateInput } from '../../components/DateInput';
import { WeightInput } from '../../components/WeightInput';
import { SelectInput } from '../../components/SelectInput';
import { FormFooter } from '../../components/FormFooter';
import { TutorFormModal } from '../../components/TutorFormModal';

const MOCK_TUTORES = [
  'Ana Maria',
  'Ana Julia',
  'Antonio Carlos',
  'Antonio Ferreira',
  'Beltrano da Silva',
  'Fulaninho de Souza',
];

const ESPECIES = ['Canino', 'Felino'];

export function NovoPetScreen() {
  const router = useRouter();

  const [tutor, setTutor] = useState('');
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [modalTutorVisible, setModalTutorVisible] = useState(false);

  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [peso, setPeso] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');

  const handleTutorCadastrado = (nomeTutor: string) => {
    setTutor(nomeTutor);
    setModalTutorVisible(false);
  };

  const handleCancelar = () => {
    router.back();
  };

  const handleSalvar = () => {
    // salvar pet: nome, dataNascimento, peso, especie, raca, tutor
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Novo Pet" onBackPress={handleCancelar} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AvatarPicker />

        <TutorAutocomplete
          value={tutor}
          onChangeText={(text) => {
            setTutor(text);
            setShowSugestoes(true);
          }}
          onFocus={() => setShowSugestoes(true)}
          showSuggestions={showSugestoes}
          suggestions={MOCK_TUTORES}
          onSelectSuggestion={(nome) => {
            setTutor(nome);
            setShowSugestoes(false);
          }}
        />

        <Text style={styles.ouText}>ou</Text>

        <GhostButton
          label="Cadastrar novo tutor"
          onPress={() => setModalTutorVisible(true)}
        />

        <Text style={styles.divider} />

        <LabeledInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.fullInput}
        />

        <Text style={styles.row}>
          <DateInput
            value={dataNascimento}
            onChange={setDataNascimento}
            style={styles.rowInputLeft}
          />
          <WeightInput
            value={peso}
            onChangeText={setPeso}
            style={styles.rowInputRight}
          />
        </Text>

        <Text style={styles.row}>
          <SelectInput
            value={especie}
            onSelect={setEspecie}
            options={ESPECIES}
            placeholder="Espécie"
            style={styles.rowInputLeft}
          />
          <LabeledInput
            placeholder="Raça"
            value={raca}
            onChangeText={setRaca}
            style={styles.rowInputRight}
          />
        </Text>
      </ScrollView>

      <FormFooter onCancel={handleCancelar} onSave={handleSalvar} />

      <TutorFormModal
        visible={modalTutorVisible}
        onCancel={() => setModalTutorVisible(false)}
        onSave={handleTutorCadastrado}
      />
    </SafeAreaView>
  );
}

export default NovoPetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  ouText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9A9A9A',
    marginTop: 14,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  fullInput: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 14,
    gap: 12,
  },
  rowInputLeft: {
    flex: 1,
  },
  rowInputRight: {
    flex: 1,
  },
});