import React, { useState } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  BackHeader,
  AvatarPicker,
  GhostButton,
  LabeledInput,
  DateInput,
  WeightInput,
  SelectInput,
  FormFooter,
} from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { TutorAutocomplete } from '../../tutores/components/TutorAutocomplete';
import { TutorFormModal } from '../../tutores/components/TutorFormModal';
import { usePets } from '../hooks/usePets';
import { useTutores } from '../../tutores/hooks/useTutores';

const ESPECIES = ['Canino', 'Felino'];

export function NewPetContainer() {
  const router = useRouter();
  const { addPet } = usePets();
  const { tutores, addTutor } = useTutores();

  const [tutor, setTutor] = useState('');
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [modalTutorVisible, setModalTutorVisible] = useState(false);

  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [peso, setPeso] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');

  const tutorNames = tutores.map((t) => t.name);

  const handleTutorCadastrado = async (data: { name: string; phone: string }) => {
    const newTutor = await addTutor(data);
    setTutor(newTutor.name);
    setModalTutorVisible(false);
  };

  const handleCancelar = () => {
    router.back();
  };

  const handleSalvar = async () => {
    if (!nome.trim()) return;
    await addPet({
      name: nome.trim(),
      tutorId: '1',
      tutorName: tutor || 'Tutor não especificado',
      species: especie || 'Canino',
      breed: raca || 'SRD',
      birthDate: dataNascimento ? dataNascimento.toLocaleDateString('pt-BR') : undefined,
      weight: peso,
    });
    router.back();
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
          suggestions={tutorNames}
          onSelectSuggestion={(nomeTutor) => {
            setTutor(nomeTutor);
            setShowSugestoes(false);
          }}
        />

        <Text style={styles.ouText}>ou</Text>

        <GhostButton
          label="Cadastrar novo tutor"
          onPress={() => setModalTutorVisible(true)}
        />

        <View style={styles.divider} />

        <LabeledInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.fullInput}
        />

        <View style={styles.row}>
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
        </View>

        <View style={styles.row}>
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
        </View>
      </ScrollView>

      <FormFooter onCancel={handleCancelar} onSave={handleSalvar} saveDisabled={!nome.trim()} />

      <TutorFormModal
        visible={modalTutorVisible}
        onCancel={() => setModalTutorVisible(false)}
        onSave={handleTutorCadastrado}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  ouText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9A9A9A',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  fullInput: {
    marginHorizontal: spacing.lg,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: 14,
    gap: spacing.md,
  },
  rowInputLeft: {
    flex: 1,
  },
  rowInputRight: {
    flex: 1,
  },
});
