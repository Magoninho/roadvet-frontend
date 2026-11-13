import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Tutor from '@/database/models/Tutor';
import { persistAvatarFile } from '@/database/repositories/avatars';
import { createTutor } from '@/database/repositories/tutores';
import { useAuth } from '@/contexts/AuthContext';
import { pickAvatarImage } from '@/utils/pickAvatarImage';
import { isValidCpf, isValidEmail, isValidPhone, maskCpf, maskPhone, sanitizeEmail } from '@/utils/validation';
import { EditableAvatar } from './EditableAvatar';
import { LabeledInput } from './LabeledInput';
import { DateInput } from './DateInput';
import { FormField } from './FormField';
import { FormRow } from './FormRow';
import { FormFooter } from './FormFooter';
import { SPACING } from '@/theme';

interface TutorFormProps {
  onCancel: () => void;
  onSave: (tutor: Tutor) => void;
}

export function TutorForm({ onCancel, onSave }: TutorFormProps) {
  const { veterinario } = useAuth();
  const [nomeCompleto, setNomeCompleto] = useState('');
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
  const [saving, setSaving] = useState(false);

  const handlePickAvatar = async () => {
    const picked = await pickAvatarImage();
    if (!picked) return;
    setAvatarUri(picked.uri);
    setAvatarFileName(picked.fileName);
  };

  const handleSalvar = async () => {
    if (!nomeCompleto.trim() || !cpf.trim() || !cep.trim() || !endereco.trim() || !numero.trim() || !bairro.trim() || !cidade.trim() || !uf.trim() || !telefone1.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *.');
      return;
    }
    if (!isValidCpf(cpf)) {
      Alert.alert('CPF inválido', 'Confira os números do CPF informado.');
      return;
    }
    if (email.trim() && !isValidEmail(email)) {
      Alert.alert('Email inválido', 'Informe um email válido, como nome@exemplo.com.');
      return;
    }
    if (!isValidPhone(telefone1) || (telefone2.trim() && !isValidPhone(telefone2))) {
      Alert.alert('Telefone inválido', 'Informe o telefone com DDD, como (85) 99999-9999.');
      return;
    }
    if (!veterinario) return;

    setSaving(true);
    try {
      const avatarUrl = avatarUri ? await persistAvatarFile(avatarUri, avatarFileName!) : null;
      const tutor = await createTutor(veterinario.id, {
        nomeCompleto: nomeCompleto.trim(),
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
        avatarUrl,
      });
      onSave(tutor);
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
        <EditableAvatar photoUrl={avatarUri ?? undefined} editable onPress={handlePickAvatar} style={styles.avatar} />

        <LabeledInput
          label="Nome completo*"
          placeholder="Nome completo do tutor"
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
          containerStyle={styles.fullInput}
        />

        <FormRow>
          <LabeledInput
            label="CPF*"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={(text) => setCpf(maskCpf(text))}
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
          onChangeText={(text) => setEmail(sanitizeEmail(text))}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.fullInput}
        />
        <LabeledInput label="CEP*" placeholder="00000-000" value={cep} onChangeText={setCep} keyboardType="numeric" containerStyle={styles.fullInput} />

        <FormRow>
          <LabeledInput label="Endereço*" placeholder="Rua, avenida..." value={endereco} onChangeText={setEndereco} containerStyle={styles.flexInputLarge} />
          <LabeledInput label="Número*" placeholder="Nº" value={numero} onChangeText={setNumero} keyboardType="numeric" containerStyle={styles.flexInputSmall} />
        </FormRow>

        <FormRow>
          <LabeledInput label="Bairro*" placeholder="Ex.: Centro" value={bairro} onChangeText={setBairro} containerStyle={styles.flexInput} />
          <LabeledInput label="Complemento" placeholder="Apto, bloco..." value={complemento} onChangeText={setComplemento} containerStyle={styles.flexInput} />
        </FormRow>

        <FormRow>
          <LabeledInput label="Cidade*" placeholder="Ex.: Fortaleza" value={cidade} onChangeText={setCidade} containerStyle={styles.flexInputLarge} />
          <LabeledInput label="UF*" placeholder="CE" value={uf} onChangeText={setUf} autoCapitalize="characters" containerStyle={styles.flexInputSmall} />
        </FormRow>

        <FormRow>
          <LabeledInput label="Telefone 1*" placeholder="(85) 99999-9999" value={telefone1} onChangeText={(text) => setTelefone1(maskPhone(text))} keyboardType="numeric" containerStyle={styles.flexInput} />
          <LabeledInput label="Telefone 2" placeholder="(85) 99999-9999" value={telefone2} onChangeText={(text) => setTelefone2(maskPhone(text))} keyboardType="numeric" containerStyle={styles.flexInput} />
        </FormRow>
      </ScrollView>

      {/* Usando o seu próprio Footer */}
      <FormFooter onCancel={onCancel} onSave={handleSalvar} saving={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.gutter,
    paddingBottom: SPACING.section,
  },
  avatar: { marginTop: 8, marginBottom: SPACING.section },
  fullInput: { marginBottom: 12 },
  flexInput: { flex: 1, minWidth: 0, flexShrink: 1 },
  flexInputLarge: { flex: 2, minWidth: 0, flexShrink: 1 },
  flexInputSmall: { flex: 1, minWidth: 0, flexShrink: 1 },
});
