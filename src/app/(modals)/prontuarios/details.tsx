import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { of } from 'rxjs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Prontuario from '@/database/models/Prontuario';
import Pet from '@/database/models/Pet';
import {
  deleteProntuario,
  getProntuarioDeletionImpact,
  observeProntuario,
  updateProntuario,
} from '@/database/repositories/prontuarios';
import { createAnexo, observeAnexosByProntuarioAndType } from '@/database/repositories/anexos';
import { useObservable } from '@/database/hooks/useObservable';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { deletionWarnings } from '@/utils/deletion';
import { formatDateBR } from '@/utils/format';
import { BackHeader } from '../../components/BackHeader';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FormFooter } from '../../components/FormFooter';
import { FormSectionTitle } from '../../components/FormSectionTitle';
import { ReadOnlyField } from '../../components/ReadOnlyField';
import { VitalReadOnlyRow } from '../../components/VitalReadOnlyRow';
import { AttachmentList } from '../../components/AttachmentList';
import { AttachmentFile } from '@/app/components/AttachmentItem';
import { VitalInputField } from '../../components/VitalInputField';
import { TextAreaField } from '../../components/TextAreaField';
import { FileUploadField } from '../../components/FileUploadField';

export default function ProntuarioDetalhe() {
  const router = useRouter();
  const { prontuarioId } = useLocalSearchParams<{ prontuarioId: string }>();

  const prontuario = useObservable<Prontuario | null>(
    () => (prontuarioId ? observeProntuario(prontuarioId) : of(null)),
    [prontuarioId],
    null,
  );
  const pet = useObservable<Pet | null>(() => (prontuario ? prontuario.pet.observe() : of(null)), [prontuario], null);
  const examRequestAnexos = useObservable(
    () => (prontuarioId ? observeAnexosByProntuarioAndType(prontuarioId, 'request') : of([])),
    [prontuarioId],
    [],
  );
  const examResultAnexos = useObservable(
    () => (prontuarioId ? observeAnexosByProntuarioAndType(prontuarioId, 'result') : of([])),
    [prontuarioId],
    [],
  );

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [prescription, setPrescription] = useState('');
  const [vaccines, setVaccines] = useState('');
  const [examRequestNotes, setExamRequestNotes] = useState('');
  const [examResultsNotes, setExamResultsNotes] = useState('');
  const [newRequestFiles, setNewRequestFiles] = useState<AttachmentFile[]>([]);
  const [newResultFiles, setNewResultFiles] = useState<AttachmentFile[]>([]);

  const seedFieldsFromProntuario = (record: Prontuario) => {
    setWeight(record.weight ?? '');
    setTemperature(record.temperature ?? '');
    setHeartRate(record.heartRate ?? '');
    setAnamnesis(record.anamnesis ?? '');
    setPhysicalExam(record.physicalExam ?? '');
    setPrescription(record.prescription ?? '');
    setVaccines(record.vaccines ?? '');
    setExamRequestNotes(record.examRequestNotes ?? '');
    setExamResultsNotes(record.examResultsNotes ?? '');
  };

  const examRequestFiles: AttachmentFile[] = examRequestAnexos.map((anexo) => ({
    id: anexo.id,
    name: anexo.fileName,
    uri: anexo.uri,
    mimeType: anexo.mimeType ?? undefined,
  }));
  const examResultFiles: AttachmentFile[] = examResultAnexos.map((anexo) => ({
    id: anexo.id,
    name: anexo.fileName,
    uri: anexo.uri,
    mimeType: anexo.mimeType ?? undefined,
  }));

  const deletion = useDeleteConfirmation({
    measure: () => getProntuarioDeletionImpact(prontuario!),
    remove: () => deleteProntuario(prontuario!),
    onDeleted: () => (router.canGoBack() ? router.back() : router.replace('/(tabs)/prontuarios')),
  });

  if (!prontuario) {
    return <SafeAreaView style={styles.container} />;
  }

  const handleBack = () => {
    router.back();
  };

  const handleOpenFile = (file: AttachmentFile) => {
    Linking.openURL(file.uri);
  };

  const handleEnableEdit = () => {
    seedFieldsFromProntuario(prontuario);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setNewRequestFiles([]);
    setNewResultFiles([]);
    setEditMode(false);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await updateProntuario(prontuario, {
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

      for (const file of newRequestFiles) {
        await createAnexo(prontuario.id, {
          fileType: 'request',
          fileName: file.name,
          uri: file.uri,
          mimeType: file.mimeType ?? null,
        });
      }
      for (const file of newResultFiles) {
        await createAnexo(prontuario.id, {
          fileType: 'result',
          fileName: file.name,
          uri: file.uri,
          mimeType: file.mimeType ?? null,
        });
      }

      setNewRequestFiles([]);
      setNewResultFiles([]);
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader
        title={`Prontuário de ${pet?.nome ?? ''}`}
        onBackPress={handleBack}
        rightElement={
          !editMode && (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleEnableEdit} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="pencil-outline" size={22} color="#2FA9E8" />
              </TouchableOpacity>
              <TouchableOpacity onPress={deletion.open} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="trash-can-outline" size={22} color="#E85C5C" />
              </TouchableOpacity>
            </View>
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
              { label: 'Peso', value: prontuario.weight ?? '', unit: 'kg' },
              { label: 'Temperatura', value: prontuario.temperature ?? '', unit: '°C' },
              { label: 'FC', value: prontuario.heartRate ?? '' },
            ]}
          />
        )}

        <FormSectionTitle text="Anamnese" />
        {editMode ? (
          <TextAreaField value={anamnesis} onChangeText={setAnamnesis} />
        ) : (
          <ReadOnlyField value={prontuario.anamnesis ?? ''} />
        )}

        <FormSectionTitle text="Exame físico" />
        {editMode ? (
          <TextAreaField value={physicalExam} onChangeText={setPhysicalExam} />
        ) : (
          <ReadOnlyField value={prontuario.physicalExam ?? ''} />
        )}

        <FormSectionTitle text="Prescrição" />
        {editMode ? (
          <TextAreaField value={prescription} onChangeText={setPrescription} />
        ) : (
          <ReadOnlyField value={prontuario.prescription ?? ''} />
        )}

        <FormSectionTitle text="Vacinas" />
        {editMode ? (
          <TextAreaField value={vaccines} onChangeText={setVaccines} placeholder="Descreva as vacinas aplicadas..." />
        ) : (
          <ReadOnlyField value={prontuario.vaccines ?? ''} />
        )}

        <FormSectionTitle text="Solicitação de exames" />
        {editMode ? (
          <>
            <TextAreaField value={examRequestNotes} onChangeText={setExamRequestNotes} />
            <AttachmentList files={examRequestFiles} onFilePress={handleOpenFile} />
            <FileUploadField
              files={newRequestFiles}
              onFilesChange={setNewRequestFiles}
              label="Anexar solicitação (PDF ou imagem)"
            />
          </>
        ) : (
          <>
            <ReadOnlyField value={prontuario.examRequestNotes ?? ''} />
            <AttachmentList files={examRequestFiles} onFilePress={handleOpenFile} />
          </>
        )}

        <FormSectionTitle text="Resultados" />
        {editMode ? (
          <>
            <TextAreaField value={examResultsNotes} onChangeText={setExamResultsNotes} />
            <AttachmentList files={examResultFiles} onFilePress={handleOpenFile} />
            <FileUploadField
              files={newResultFiles}
              onFilesChange={setNewResultFiles}
              label="Anexar resultados (PDF ou imagem)"
            />
          </>
        ) : (
          <>
            <ReadOnlyField value={prontuario.examResultsNotes ?? ''} />
            <AttachmentList files={examResultFiles} onFilePress={handleOpenFile} />
          </>
        )}
      </ScrollView>

      {editMode && <FormFooter onCancel={handleCancelEdit} onSave={handleSaveEdit} saving={saving} />}

      <ConfirmDialog
        visible={deletion.visible}
        title="Excluir prontuário"
        message={`Tem certeza que deseja excluir o prontuário${pet ? ` de ${pet.nome}` : ''} do dia ${formatDateBR(prontuario.date)}? Os anexos de exames deste prontuário também serão excluídos.`}
        warnings={deletionWarnings(deletion.impact)}
        loading={deletion.deleting}
        error={deletion.error}
        onConfirm={deletion.confirm}
        onCancel={deletion.cancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
});
