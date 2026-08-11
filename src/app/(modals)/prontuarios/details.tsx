import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BackHeader } from '../../components/BackHeader';
import { FormFooter } from '../../components/FormFooter';
import { FormSectionTitle } from '../../components/FormSectionTitle';
import { ReadOnlyField } from '../../components/ReadOnlyField';
import { VitalReadOnlyRow } from '../../components/VitalReadOnlyRow';
import { AttachmentList, AttachmentFile } from '../../components/AttachmentList';
import { VitalInputField } from '../../components/VitalInputField';
import { TextAreaField } from '../../components/TextAreaField';
import { FileUploadField } from '../../components/FileUploadField';

const MOCK_PRONTUARIO = {
  id: '1',
  petName: 'Mingau',
  date: '22/04/2026',
  weight: '4.2',
  temperature: '38.5',
  heartRate: '110',
  anamnesis: 'Tutor relata que o pet apresentou dores na pata traseira direita há 3 dias.',
  physicalExam: 'Animal alerta, hidratado. Dor à palpação em membro posterior direito.',
  prescription: 'Antibiótico via oral por 7 dias. Repouso.',
  examRequestNotes: 'Solicitado raio-x do membro posterior direito.',
  examRequestFiles: [
    { id: '1', name: 'pedido_raiox.pdf', uri: 'https://example.com/pedido_raiox.pdf', mimeType: 'application/pdf' },
  ] as AttachmentFile[],
  examResultsNotes: 'Sem fraturas visíveis. Leve inflamação de tecido mole.',
  examResultFiles: [
    { id: '2', name: 'resultado_raiox.jpg', uri: 'https://example.com/resultado_raiox.jpg', mimeType: 'image/jpeg' },
  ] as AttachmentFile[],
};

export default function ProntuarioDetalhe() {
  const router = useRouter();
  const { prontuarioId } = useLocalSearchParams<{ prontuarioId: string }>();

  const [editMode, setEditMode] = useState(false);

  const [weight, setWeight] = useState(MOCK_PRONTUARIO.weight);
  const [temperature, setTemperature] = useState(MOCK_PRONTUARIO.temperature);
  const [heartRate, setHeartRate] = useState(MOCK_PRONTUARIO.heartRate);
  const [anamnesis, setAnamnesis] = useState(MOCK_PRONTUARIO.anamnesis);
  const [physicalExam, setPhysicalExam] = useState(MOCK_PRONTUARIO.physicalExam);
  const [prescription, setPrescription] = useState(MOCK_PRONTUARIO.prescription);
  const [examRequestNotes, setExamRequestNotes] = useState(MOCK_PRONTUARIO.examRequestNotes);
  const [examRequestFiles, setExamRequestFiles] = useState<AttachmentFile[]>(MOCK_PRONTUARIO.examRequestFiles);
  const [examResultsNotes, setExamResultsNotes] = useState(MOCK_PRONTUARIO.examResultsNotes);
  const [examResultFiles, setExamResultFiles] = useState<AttachmentFile[]>(MOCK_PRONTUARIO.examResultFiles);

  const handleBack = () => {
    router.back();
  };

  const handleOpenFile = (file: AttachmentFile) => {
    Linking.openURL(file.uri);
  };

  const handleEnableEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    // reverte para os valores originais
    setWeight(MOCK_PRONTUARIO.weight);
    setTemperature(MOCK_PRONTUARIO.temperature);
    setHeartRate(MOCK_PRONTUARIO.heartRate);
    setAnamnesis(MOCK_PRONTUARIO.anamnesis);
    setPhysicalExam(MOCK_PRONTUARIO.physicalExam);
    setPrescription(MOCK_PRONTUARIO.prescription);
    setExamRequestNotes(MOCK_PRONTUARIO.examRequestNotes);
    setExamRequestFiles(MOCK_PRONTUARIO.examRequestFiles);
    setExamResultsNotes(MOCK_PRONTUARIO.examResultsNotes);
    setExamResultFiles(MOCK_PRONTUARIO.examResultFiles);
    setEditMode(false);
  };

  const handleSaveEdit = () => {
    // salvar alterações do prontuário (weight, temperature, heartRate, anamnesis, etc.)
    setEditMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader
        title={`Prontuário de ${MOCK_PRONTUARIO.petName}`}
        onBackPress={handleBack}
        rightElement={
          !editMode && (
            <TouchableOpacity onPress={handleEnableEdit} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="pencil-outline" size={22} color="#2FA9E8" />
            </TouchableOpacity>
          )
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <FormSectionTitle text="Parâmetros vitais" />
        {editMode ? (
          <>
            <VitalInputField placeholder="Peso..." value={weight} onChangeText={setWeight} unit="kg" keyboardType="numeric" />
            <VitalInputField placeholder="Temperatura..." value={temperature} onChangeText={setTemperature} unit="°C" keyboardType="numeric" />
            <VitalInputField placeholder="FC" value={heartRate} onChangeText={setHeartRate} keyboardType="numeric" />
          </>
        ) : (
          <VitalReadOnlyRow
            items={[
              { label: 'Peso', value: weight, unit: 'kg' },
              { label: 'Temperatura', value: temperature, unit: '°C' },
              { label: 'FC', value: heartRate },
            ]}
          />
        )}

        <FormSectionTitle text="Anamnese" />
        {editMode ? (
          <TextAreaField value={anamnesis} onChangeText={setAnamnesis} />
        ) : (
          <ReadOnlyField value={anamnesis} />
        )}

        <FormSectionTitle text="Exame físico" />
        {editMode ? (
          <TextAreaField value={physicalExam} onChangeText={setPhysicalExam} />
        ) : (
          <ReadOnlyField value={physicalExam} />
        )}

        <FormSectionTitle text="Prescrição" />
        {editMode ? (
          <TextAreaField value={prescription} onChangeText={setPrescription} />
        ) : (
          <ReadOnlyField value={prescription} />
        )}

        <FormSectionTitle text="Solicitação de exames" />
        {editMode ? (
          <>
            <TextAreaField value={examRequestNotes} onChangeText={setExamRequestNotes} />
            <FileUploadField
              files={examRequestFiles}
              onFilesChange={setExamRequestFiles}
              label="Anexar solicitação (PDF ou imagem)"
            />
          </>
        ) : (
          <>
            <ReadOnlyField value={examRequestNotes} />
            <AttachmentList files={examRequestFiles} onFilePress={handleOpenFile} />
          </>
        )}

        <FormSectionTitle text="Resultados" />
        {editMode ? (
          <>
            <TextAreaField value={examResultsNotes} onChangeText={setExamResultsNotes} />
            <FileUploadField
              files={examResultFiles}
              onFilesChange={setExamResultFiles}
              label="Anexar resultados (PDF ou imagem)"
            />
          </>
        ) : (
          <>
            <ReadOnlyField value={examResultsNotes} />
            <AttachmentList files={examResultFiles} onFilePress={handleOpenFile} />
          </>
        )}
      </ScrollView>

      {editMode && <FormFooter onCancel={handleCancelEdit} onSave={handleSaveEdit} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
