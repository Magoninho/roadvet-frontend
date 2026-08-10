import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BackHeader } from '../../components/BackHeader';
import { FormSectionTitle } from '../../components/FormSectionTitle';
import { VitalInputField } from '../../components/VitalInputField';
import { TextAreaField } from '../../components/TextAreaField';
import { FormFooter } from '../../components/FormFooter';
import { useRouter } from 'expo-router';

export default function NewProntuarioScreen() {
  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [prescription, setPrescription] = useState('');

  const router = useRouter();

  const petName = 'Mingau';

  const handleBack = () => {
    router.back()
  };

  const handleCancel = () => {
    router.back()
  };

  const handleSave = () => {
    // salvar prontuário
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title={`Novo prontuário para ${petName}`} onBackPress={handleBack} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <FormSectionTitle text="Parâmetros vitais" />
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

          <FormSectionTitle text="Anamnese" />
          <TextAreaField value={anamnesis} onChangeText={setAnamnesis} />

          <FormSectionTitle text="Exame físico" />
          <TextAreaField value={physicalExam} onChangeText={setPhysicalExam} />

          <FormSectionTitle text="Prescrição" />
          <TextAreaField value={prescription} onChangeText={setPrescription} />
        </ScrollView>

        <FormFooter onCancel={handleCancel} onSave={handleSave} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
});
