import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { showAlert } from '@/utils/showAlert';
import { of } from 'rxjs';
import Pet from '@/database/models/Pet';
import Tutor from '@/database/models/Tutor';
import { persistAvatarFile } from '@/database/repositories/avatars';
import { createPet } from '@/database/repositories/pets';
import { observeTutoresWhereNome } from '@/database/repositories/tutores';
import { useAuth } from '@/contexts/AuthContext';
import { pickAvatarImage } from '@/utils/pickAvatarImage';
import { speciesToIcon } from '@/utils/format';
import { ESPECIES } from '@/utils/racas';
import { BreedSelectInput } from './BreedSelectInput';
import { DateInput } from './DateInput';
import { EditableAvatar } from './EditableAvatar';
import { FormField } from './FormField';
import { FormFooter } from './FormFooter';
import { GhostButton } from './GhostButton';
import { LabeledInput } from './LabeledInput';
import { SelectInput } from './SelectInput';
import { TutorAutocomplete, TutorSuggestion } from './TutorAutocomplete';
import { TutorFormModal } from './TutorFormModal';
import { WeightInput } from './WeightInput';
import { COLORS, SPACING } from '@/theme';

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
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // A raça escolhida pertence à espécie anterior, então é descartada quando a espécie muda.
  const handleSelectEspecie = (novaEspecie: string) => {
    if (novaEspecie !== especie) setRaca('');
    setEspecie(novaEspecie);
  };

  const handlePickAvatar = async () => {
    const picked = await pickAvatarImage();
    if (!picked) return;
    setAvatarUri(picked.uri);
    setAvatarFileName(picked.fileName);
  };

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
      showAlert('Tutor obrigatório', 'Selecione um tutor cadastrado ou cadastre um novo antes de salvar.');
      return;
    }
    if (!nome.trim() || !especie) {
      showAlert('Campos obrigatórios', 'Preencha o nome e a espécie do pet.');
      return;
    }

    setSaving(true);
    try {
      const avatarUrl = avatarUri ? await persistAvatarFile(avatarUri, avatarFileName!) : null;
      const pet = await createPet(resolvedTutorId, {
        nome: nome.trim(),
        dataNascimento,
        peso: peso.trim() || null,
        especie,
        raca: raca.trim() || null,
        avatarUrl,
      });
      onSave(pet);
    } catch (error) {
      console.error(error);
      showAlert('Erro ao salvar', 'Não foi possível salvar o pet. Tente novamente.');
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
        <EditableAvatar
          photoUrl={avatarUri ?? undefined}
          fallbackIcon={speciesToIcon(especie)}
          editable
          onPress={handlePickAvatar}
          style={styles.avatar}
        />

        {/* Renderização condicional da seleção de Tutor */}
        {showTutorSection && (
          <>
            <TutorAutocomplete
              label="Tutor responsável*"
              placeholder="Buscar pelo nome do tutor"
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

        <LabeledInput
          label="Nome do pet*"
          placeholder="Ex.: Rex"
          value={nome}
          onChangeText={setNome}
          containerStyle={styles.fullInput}
        />

        <View style={styles.row}>
          <FormField label="Data de nascimento" style={styles.rowInputLeft}>
            <DateInput value={dataNascimento} onChange={setDataNascimento} placeholder="DD/MM/AAAA" />
          </FormField>
          <FormField label="Peso" style={styles.rowInputRight}>
            <WeightInput value={peso} onChangeText={setPeso} placeholder="0,0" />
          </FormField>
        </View>

        <View style={styles.row}>
          <FormField label="Espécie*" style={styles.rowInputLeft}>
            <SelectInput value={especie} onSelect={handleSelectEspecie} options={ESPECIES} placeholder="Selecione" />
          </FormField>
          <FormField label="Raça" style={styles.rowInputRight}>
            <BreedSelectInput
              especie={especie}
              value={raca}
              onSelect={setRaca}
              placeholder={especie ? 'Selecione' : 'Escolha a espécie'}
            />
          </FormField>
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
  scrollContent: { paddingBottom: SPACING.section },
  avatar: { marginTop: 8, marginBottom: SPACING.section },
  ouText: { textAlign: 'center', fontSize: 13, color: COLORS.textMuted, marginTop: 12, marginBottom: 12 },
  divider: { height: 1, backgroundColor: COLORS.divider, marginTop: SPACING.block, marginBottom: SPACING.section },
  fullInput: { marginHorizontal: SPACING.gutter, marginBottom: 12 },
  row: { flexDirection: 'row', marginHorizontal: SPACING.gutter, marginBottom: 12, gap: 12, alignItems: 'flex-start' },
  rowInputLeft: { flex: 1 },
  rowInputRight: { flex: 1 },
});
