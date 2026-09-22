import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { of } from 'rxjs';
import Pet from '@/database/models/Pet';
import Tutor from '@/database/models/Tutor';
import { createPet } from '@/database/repositories/pets';
import { observeTutoresWhereNome } from '@/database/repositories/tutores';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarPicker } from './AvatarPicker';
import { DateInput } from './DateInput';
import { FormFooter } from './FormFooter';
import { GhostButton } from './GhostButton';
import { LabeledInput } from './LabeledInput';
import { SelectInput } from './SelectInput';
import { TutorAutocomplete, TutorSuggestion } from './TutorAutocomplete';
import { TutorFormModal } from './TutorFormModal';
import { WeightInput } from './WeightInput';

const ESPECIES = ['Canino', 'Felino'];

interface PetFormProps {
  onCancel: () => void;
  onSave: (pet: Pet) => void;
  showTutorSection?: boolean; // Define se a seção de escolher tutor aparece
  tutorId?: string; // Obrigatório quando showTutorSection é false: tutor já conhecido pela tela chamadora
}

export function PetForm({ onCancel, onSave, showTutorSection = true, tutorId }: PetFormProps) {
  const { veterinario } = useAuth();
  // Estados do Tutor (só usados se showTutorSection for true)
  const [tutorQuery, setTutorQuery] = useState('');
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<TutorSuggestion[]>([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [modalTutorVisible, setModalTutorVisible] = useState(false);

  // Estados do Pet
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [peso, setPeso] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!showTutorSection || !veterinario) return;

    const query$ = tutorQuery.trim() ? observeTutoresWhereNome(veterinario.id, tutorQuery) : of([]);
    const subscription = query$.subscribe((tutores) => {
      setSuggestions(tutores.map((tutor) => ({ id: tutor.id, label: tutor.nomeCompleto })));
    });
    return () => subscription.unsubscribe();
  }, [tutorQuery, showTutorSection, veterinario]);

  const handleTutorCadastrado = (tutor: Tutor) => {
    setTutorQuery(tutor.nomeCompleto);
    setSelectedTutorId(tutor.id);
    setModalTutorVisible(false);
  };

  const handleSalvar = async () => {
    const resolvedTutorId = showTutorSection ? selectedTutorId : tutorId;

    if (!resolvedTutorId) {
      Alert.alert('Tutor obrigatório', 'Selecione um tutor cadastrado ou cadastre um novo antes de salvar.');
      return;
    }
    if (!nome.trim() || !especie) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome e a espécie do pet.');
      return;
    }

    setSaving(true);
    try {
      const pet = await createPet(resolvedTutorId, {
        nome: nome.trim(),
        dataNascimento,
        peso: peso.trim() || null,
        especie,
        raca: raca.trim() || null,
      });
      onSave(pet);
    } finally {
      setSaving(false);
    }
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
              value={tutorQuery}
              onChangeText={(text) => {
                setTutorQuery(text);
                setSelectedTutorId(null);
                setShowSugestoes(true);
              }}
              onFocus={() => setShowSugestoes(true)}
              showSuggestions={showSugestoes}
              suggestions={suggestions}
              onSelectSuggestion={(suggestion) => {
                setTutorQuery(suggestion.label);
                setSelectedTutorId(suggestion.id);
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

        <LabeledInput placeholder="Nome do pet" value={nome} onChangeText={setNome} style={styles.fullInput} />

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

      <FormFooter onCancel={onCancel} onSave={handleSalvar} saving={saving} />

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
