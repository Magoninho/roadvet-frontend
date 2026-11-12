import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import Pet from '@/database/models/Pet';
import { observePet } from '@/database/repositories/pets';
import { createProntuario } from '@/database/repositories/prontuarios';
import { createAnexo } from '@/database/repositories/anexos';
import { useObservable } from '@/database/hooks/useObservable';
import { useAuth } from '@/contexts/AuthContext';
import { BackHeader } from '../../components/BackHeader';
import { FormFooter } from '../../components/FormFooter';
import { FormSectionTitle } from '../../components/FormSectionTitle';
import { TextAreaField } from '../../components/TextAreaField';
import { VitalInputField } from '../../components/VitalInputField';
import { FileUploadField, AttachmentFile } from '../../components/FileUploadField';
import { COLORS } from '@/theme';

export default function NewProntuario() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { veterinario } = useAuth();
  const pet = useObservable<Pet | null>(() => (petId ? observePet(petId) : of(null)), [petId], null);

  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [prescription, setPrescription] = useState('');
  const [vaccines, setVaccines] = useState('');

  const [examRequestNotes, setExamRequestNotes] = useState('');
  const [examRequestFiles, setExamRequestFiles] = useState<AttachmentFile[]>([]);

  const [examResultsNotes, setExamResultsNotes] = useState('');
  const [examResultFiles, setExamResultFiles] = useState<AttachmentFile[]>([]);

  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!petId || !veterinario) {
      return;
    }

    setSaving(true);
    try {
      const prontuario = await createProntuario(petId, veterinario.id, {
        date: new Date(),
        weight: weight.trim() || null,
        temperature: temperature.trim() || null,
        heartRate: heartRate.trim() || null,
        anamnesis: anamnesis.trim() || null,
        physicalExam: physicalExam.trim() || null,
        prescription: prescription.trim() || null,
        vaccines: vaccines.trim() || null,
        examRequestNotes: examRequestNotes.trim() || null,
        examResultsNotes: examResultsNotes.trim() || null,
      });

      for (const file of examRequestFiles) {
        await createAnexo(prontuario.id, {
          fileType: 'request',
          fileName: file.name,
          uri: file.uri,
          mimeType: file.mimeType ?? null,
        });
      }
      for (const file of examResultFiles) {
        await createAnexo(prontuario.id, {
          fileType: 'result',
          fileName: file.name,
          uri: file.uri,
          mimeType: file.mimeType ?? null,
        });
      }

      router.replace({ pathname: '/(modals)/prontuarios/details', params: { prontuarioId: prontuario.id } });
    } catch (error) {
      Alert.alert('Erro ao salvar', 'Não foi possível salvar o prontuário. Tente novamente.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <BackHeader title={`Novo prontuário para ${pet?.nome ?? ''}`} onBackPress={handleBack} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        automaticOffset
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

          <FormSectionTitle text="Vacinas" />
          <TextAreaField
            value={vaccines}
            onChangeText={setVaccines}
            placeholder="Descreva as vacinas aplicadas..."
          />

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

        <FormFooter onCancel={handleCancel} onSave={handleSave} saving={saving} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: {
    flex: 1,
  },
});
