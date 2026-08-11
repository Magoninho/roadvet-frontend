import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { BackHeader } from '../../components/BackHeader';
import { AvatarPicker } from '../../components/AvatarPicker';
import { LabeledInput } from '../../components/LabeledInput';
import { DateInput } from '../../components/DateInput';
import { FormRow } from '../../components/FormRow';
import { FormFooter } from '../../components/FormFooter';

export function NovoTutorScreen() {
  const router = useRouter();

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

  const handleBack = () => {
    router.back();
  };

  const handleCancelar = () => {
    router.back();
  };

  const handleSalvar = () => {
    // salvar tutor: nomeCompleto, cpf, dataNascimento, email, cep,
    // endereco, numero, bairro, complemento, cidade, uf, telefone1, telefone2
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Novo Tutor" onBackPress={handleBack} />

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

        <LabeledInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.fullInput}
        />

        <LabeledInput
          placeholder="CEP*"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
          style={styles.fullInput}
        />

        <FormRow>
          <LabeledInput
            placeholder="Endereço*"
            value={endereco}
            onChangeText={setEndereco}
            style={styles.flexInputLarge}
          />
          <LabeledInput
            placeholder="Número*"
            value={numero}
            onChangeText={setNumero}
            keyboardType="numeric"
            style={styles.flexInputSmall}
          />
        </FormRow>

        <FormRow>
          <LabeledInput
            placeholder="Bairro*"
            value={bairro}
            onChangeText={setBairro}
            style={styles.flexInput}
          />
          <LabeledInput
            placeholder="Complemento"
            value={complemento}
            onChangeText={setComplemento}
            style={styles.flexInput}
          />
        </FormRow>

        <FormRow>
          <LabeledInput
            placeholder="Cidade*"
            value={cidade}
            onChangeText={setCidade}
            style={styles.flexInputLarge}
          />
          <LabeledInput
            placeholder="UF*"
            value={uf}
            onChangeText={setUf}
            style={styles.flexInputSmall}
          />
        </FormRow>

        <FormRow>
          <LabeledInput
            placeholder="Telefone 1*"
            value={telefone1}
            onChangeText={setTelefone1}
            keyboardType="numeric"
            style={styles.flexInput}
          />
          <LabeledInput
            placeholder="Telefone 2"
            value={telefone2}
            onChangeText={setTelefone2}
            keyboardType="numeric"
            style={styles.flexInput}
          />
        </FormRow>
      </ScrollView>

      <FormFooter onCancel={handleCancelar} onSave={handleSalvar} />
    </SafeAreaView>
  );
}

export default NovoTutorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  fullInput: {
    // marginHorizontal: 16,
    marginBottom: 14,
  },
  flexInput: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
  flexInputLarge: {
    flex: 2,
    minWidth: 0,
    flexShrink: 1,
  },
  flexInputSmall: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
});