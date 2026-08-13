import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AvatarPicker } from './AvatarPicker'; // Ajuste os imports
import { LabeledInput } from './LabeledInput';
import { DateInput } from './DateInput';
import { FormRow } from './FormRow';
import { FormFooter } from './FormFooter';

interface TutorFormProps {
  onCancel: () => void;
  onSave: (nomeTutor: string) => void; 
  // No futuro, onSave pode retornar o objeto completo do tutor
}

export function TutorForm({ onCancel, onSave }: TutorFormProps) {
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

  const handleSalvar = () => {
    // TODO: Adicionar validações e chamada à API aqui
    
    // Retorna o nome do tutor para quem chamou o componente
    onSave(nomeCompleto || 'Novo Tutor Sem Nome');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AvatarPicker />

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
      <FormFooter onCancel={onCancel} onSave={handleSalvar} />
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