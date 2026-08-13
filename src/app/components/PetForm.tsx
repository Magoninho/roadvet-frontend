import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AvatarPicker } from './AvatarPicker';
import { DateInput } from './DateInput';
import { FormFooter } from './FormFooter';
import { GhostButton } from './GhostButton';
import { LabeledInput } from './LabeledInput';
import { SelectInput } from './SelectInput';
import { TutorAutocomplete } from './TutorAutocomplete';
import { TutorFormModal } from './TutorFormModal';
import { WeightInput } from './WeightInput';

const MOCK_TUTORES = [
  'Ana Maria', 'Ana Julia', 'Antonio Carlos', 
  'Antonio Ferreira', 'Beltrano da Silva', 'Fulaninho de Souza',
];
const ESPECIES = ['Canino', 'Felino'];

interface PetFormProps {
  onCancel: () => void;
  onSave: (petData: any) => void;
  showTutorSection?: boolean; // Define se a seção de escolher tutor aparece
}

export function PetForm({ onCancel, onSave, showTutorSection = true }: PetFormProps) {
  // Estados do Tutor (só usados se showTutorSection for true)
  const [tutor, setTutor] = useState('');
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [modalTutorVisible, setModalTutorVisible] = useState(false);

  // Estados do Pet
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [peso, setPeso] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');

  const handleTutorCadastrado = (nomeTutor: string) => {
    setTutor(nomeTutor);
    setModalTutorVisible(false);
  };

  const handleSalvar = () => {
    // Retorna os dados do pet. 
    // Se não tiver a seção do tutor, o campo 'tutor' vai vazio, 
    // e a tela que chamou (a de detalhes) fica responsável por vincular o ID.
    onSave({ tutor, nome, dataNascimento, peso, especie, raca });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AvatarPicker />

        {/* Renderização condicional da seleção de Tutor */}
        {showTutorSection && (
          <>
            <TutorAutocomplete
              value={tutor}
              onChangeText={(text) => {
                setTutor(text);
                setShowSugestoes(true);
              }}
              onFocus={() => setShowSugestoes(true)}
              showSuggestions={showSugestoes}
              suggestions={MOCK_TUTORES}
              onSelectSuggestion={(nomeSelecionado) => {
                setTutor(nomeSelecionado);
                setShowSugestoes(false);
              }}
            />

            <Text style={styles.ouText}>ou</Text>

            <GhostButton
              label="Cadastrar novo tutor"
              onPress={() => setModalTutorVisible(true)}
            />

            <Text style={styles.divider} />
          </>
        )}

        <LabeledInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.fullInput} />

        <View style={styles.row}>
          <DateInput value={dataNascimento} onChange={setDataNascimento} style={styles.rowInputLeft} />
          <WeightInput value={peso} onChangeText={setPeso} style={styles.rowInputRight} />
        </View>

        <View style={styles.row}>
          <SelectInput
            value={especie}
            onSelect={setEspecie}
            options={ESPECIES}
            placeholder="Espécie"
            style={styles.rowInputLeft}
          />
          <LabeledInput placeholder="Raça" value={raca} onChangeText={setRaca} style={styles.rowInputRight} />
        </View>
      </ScrollView>

      <FormFooter onCancel={onCancel} onSave={handleSalvar} />

      {/* Modal de Tutor também condicionado */}
      {showTutorSection && (
        <TutorFormModal
          visible={modalTutorVisible}
          onCancel={() => setModalTutorVisible(false)}
          onSave={handleTutorCadastrado}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  ouText: { textAlign: 'center', fontSize: 13, color: '#9A9A9A', marginTop: 14, marginBottom: 14 },
  divider: { height: 1, backgroundColor: '#E5E5E5', marginHorizontal: 16, marginTop: 20, marginBottom: 20 },
  fullInput: { marginHorizontal: 16, marginBottom: 14 },
  row: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 14, gap: 12, alignItems: 'flex-start' },
  rowInputLeft: { flex: 1 },
  rowInputRight: { flex: 1 },
});