import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Tutor from '@/database/models/Tutor';
import { createTutor } from '@/database/repositories/tutores';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarPicker } from './AvatarPicker'; // Ajuste os imports
import { LabeledInput } from './LabeledInput';
import { DateInput } from './DateInput';
import { FormRow } from './FormRow';
import { FormFooter } from './FormFooter';

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSalvar = async () => {
    if (!nomeCompleto.trim() || !cpf.trim() || !cep.trim() || !endereco.trim() || !numero.trim() || !bairro.trim() || !cidade.trim() || !uf.trim() || !telefone1.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *.');
      return;
    }
    if (!veterinario) return;

    setSaving(true);
    try {
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
        avatarUrl: avatarUrl || null,
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
        <AvatarPicker imageUri={avatarUrl} onSelectImage={setAvatarUrl} />

        <LabeledInput
          placeholder="Nome completo*"
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
          style={styles.fullInput}
        />

        <FormRow>
          <LabeledInput
            placeholder="CPF*"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
            style={styles.flexInput}
          />
          <DateInput
            value={dataNascimento}
            onChange={setDataNascimento}
            placeholder="Data de nasc."
            style={styles.flexInput}
          />
        </FormRow>

        <LabeledInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.fullInput} />
        <LabeledInput placeholder="CEP*" value={cep} onChangeText={setCep} keyboardType="numeric" style={styles.fullInput} />

        <FormRow>
          <LabeledInput placeholder="Endereço*" value={endereco} onChangeText={setEndereco} style={styles.flexInputLarge} />
          <LabeledInput placeholder="Número*" value={numero} onChangeText={setNumero} keyboardType="numeric" style={styles.flexInputSmall} />
        </FormRow>

        <FormRow>
          <LabeledInput placeholder="Bairro*" value={bairro} onChangeText={setBairro} style={styles.flexInput} />
          <LabeledInput placeholder="Complemento" value={complemento} onChangeText={setComplemento} style={styles.flexInput} />
        </FormRow>

        <FormRow>
          <LabeledInput placeholder="Cidade*" value={cidade} onChangeText={setCidade} style={styles.flexInputLarge} />
          <LabeledInput placeholder="UF*" value={uf} onChangeText={setUf} style={styles.flexInputSmall} />
        </FormRow>

        <FormRow>
          <LabeledInput placeholder="Telefone 1*" value={telefone1} onChangeText={setTelefone1} keyboardType="numeric" style={styles.flexInput} />
          <LabeledInput placeholder="Telefone 2" value={telefone2} onChangeText={setTelefone2} keyboardType="numeric" style={styles.flexInput} />
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
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  fullInput: { marginBottom: 14 },
  flexInput: { flex: 1, minWidth: 0, flexShrink: 1 },
  flexInputLarge: { flex: 2, minWidth: 0, flexShrink: 1 },
  flexInputSmall: { flex: 1, minWidth: 0, flexShrink: 1 },
});
