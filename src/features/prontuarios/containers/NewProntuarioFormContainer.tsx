import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackHeader, FormSectionTitle, VitalInputField, TextAreaField, FormFooter } from '../../../ui/components';
import { colors } from '../../../ui/theme';
import { useProntuarios } from '../hooks/useProntuarios';

export function NewProntuarioFormContainer() {
  const router = useRouter();
  const params = useLocalSearchParams<{ petId?: string }>();
  const { addRecord } = useProntuarios();

  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [prescription, setPrescription] = useState('');

  const petName = 'Mingau';

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    await addRecord({
      petId: params.petId || '1',
      petName,
      tutorName: 'Ana Silva',
      date: new Date().toLocaleDateString('pt-BR'),
      type: 'medication',
      title: prescription.trim() || 'Consulta geral',
      notes: `${anamnesis}\n\nExame: ${physicalExam}`.trim(),
      vitalSigns: {
        temperature,
        heartRate,
      },
    });
    router.dismissAll();
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title={`Novo prontuário para ${petName}`} onBackPress={handleBack} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <FormSectionTitle title="Parâmetros vitais" />
          <VitalInputField
            placeholder="Peso..."
            value={weight}
            onChangeText={setWeight}
            unit="kg"
            keyboardType="numeric"
          />
          <VitalInputField
            placeholder="Temperatura..."
            value={temperature}
            onChangeText={setTemperature}
            unit="°C"
            keyboardType="numeric"
          />
          <VitalInputField
            placeholder="FC"
            value={heartRate}
            onChangeText={setHeartRate}
            keyboardType="numeric"
          />

          <FormSectionTitle title="Anamnese" />
          <TextAreaField value={anamnesis} onChangeText={setAnamnesis} />

          <FormSectionTitle title="Exame físico" />
          <TextAreaField value={physicalExam} onChangeText={setPhysicalExam} />

          <FormSectionTitle title="Prescrição" />
          <TextAreaField value={prescription} onChangeText={setPrescription} />
        </ScrollView>

        <FormFooter onCancel={handleBack} onSave={handleSave} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  flex: {
    flex: 1,
  },
});
