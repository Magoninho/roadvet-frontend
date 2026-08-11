import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '../../components/BackHeader';
import { FormFooter } from '../../components/FormFooter';
import { FormSectionTitle } from '../../components/FormSectionTitle';
import { TextAreaField } from '../../components/TextAreaField';
import { VitalInputField } from '../../components/VitalInputField';
import { FileUploadField, AttachmentFile } from '../../components/FileUploadField';

export default function NewProntuario() {
  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [prescription, setPrescription] = useState('');

  const [examRequestNotes, setExamRequestNotes] = useState('');
  const [examRequestFiles, setExamRequestFiles] = useState<AttachmentFile[]>([]);

  const [examResultsNotes, setExamResultsNotes] = useState('');
  const [examResultFiles, setExamResultFiles] = useState<AttachmentFile[]>([]);

  const router = useRouter();

  const petName = 'Mingau';

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    // salvar prontuário, incluindo examRequestFiles e examResultFiles
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

          <FormSectionTitle text="Solicitação de exames" />
          <TextAreaField
            value={examRequestNotes}
            onChangeText={setExamRequestNotes}
            placeholder="Descreva os exames solicitados..."
          />
          <FileUploadField
            files={examRequestFiles}
            onFilesChange={setExamRequestFiles}
            label="Anexar solicitação (PDF ou imagem)"
          />

          <FormSectionTitle text="Resultados" />
          <TextAreaField
            value={examResultsNotes}
            onChangeText={setExamResultsNotes}
            placeholder="Observações sobre os resultados..."
          />
          <FileUploadField
            files={examResultFiles}
            onFilesChange={setExamResultFiles}
            label="Anexar resultados (PDF ou imagem)"
          />
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