import { Q } from '@nozbe/watermelondb';
import { database } from '../index';
import Prontuario from '../models/Prontuario';
import { deleteProntuario as cascadeDeleteProntuario, measureProntuarioDeletion } from './cascade';

export interface ProntuarioInput {
  date: Date;
  weight?: string | null;
  temperature?: string | null;
  heartRate?: string | null;
  anamnesis?: string | null;
  physicalExam?: string | null;
  prescription?: string | null;
  vaccines?: string | null;
  examRequestNotes?: string | null;
  examResultsNotes?: string | null;
}

const prontuariosCollection = () => database.get<Prontuario>('prontuarios');

function applyProntuarioInput(prontuario: Prontuario, input: Partial<ProntuarioInput>) {
  if (input.date !== undefined) prontuario.date = input.date;
  if (input.weight !== undefined) prontuario.weight = input.weight ?? null;
  if (input.temperature !== undefined) prontuario.temperature = input.temperature ?? null;
  if (input.heartRate !== undefined) prontuario.heartRate = input.heartRate ?? null;
  if (input.anamnesis !== undefined) prontuario.anamnesis = input.anamnesis ?? null;
  if (input.physicalExam !== undefined) prontuario.physicalExam = input.physicalExam ?? null;
  if (input.prescription !== undefined) prontuario.prescription = input.prescription ?? null;
  if (input.vaccines !== undefined) prontuario.vaccines = input.vaccines ?? null;
  if (input.examRequestNotes !== undefined) prontuario.examRequestNotes = input.examRequestNotes ?? null;
  if (input.examResultsNotes !== undefined) prontuario.examResultsNotes = input.examResultsNotes ?? null;
}

export async function createProntuario(
  petId: string,
  veterinarioId: string,
  input: ProntuarioInput,
): Promise<Prontuario> {
  return database.write(() =>
    prontuariosCollection().create((prontuario) => {
      prontuario.petId = petId;
      prontuario.veterinarioId = veterinarioId;
      applyProntuarioInput(prontuario, input);
    }),
  );
}

export async function updateProntuario(prontuario: Prontuario, input: Partial<ProntuarioInput>): Promise<Prontuario> {
  return database.write(() => prontuario.update((record) => applyProntuarioInput(record, input)));
}

export async function deleteProntuario(prontuario: Prontuario): Promise<void> {
  // Cascades to anexos_prontuario, deleting attachment files too.
  await cascadeDeleteProntuario(prontuario);
}

/** What `deleteProntuario` would take with it (its anexos). */
export function getProntuarioDeletionImpact(prontuario: Prontuario) {
  return measureProntuarioDeletion(prontuario);
}

export function observeProntuariosByPet(petId: string) {
  return prontuariosCollection()
    .query(Q.where('pet_id', petId), Q.sortBy('date', Q.desc))
    .observe();
}

/** Columns whose edits must refresh a prontuário list (displayed or searched on). */
export const PRONTUARIO_LIST_COLUMNS = [
  'pet_id', 'date', 'weight', 'anamnesis', 'physical_exam',
  'prescription', 'vaccines', 'exam_request_notes', 'exam_results_notes',
];

export function observeProntuariosByVeterinario(veterinarioId: string) {
  return prontuariosCollection()
    .query(Q.where('veterinario_id', veterinarioId), Q.sortBy('date', Q.desc))
    .observeWithColumns(PRONTUARIO_LIST_COLUMNS);
}

export function observeProntuario(id: string) {
  return prontuariosCollection().findAndObserve(id);
}

export async function findProntuarioById(id: string): Promise<Prontuario> {
  return prontuariosCollection().find(id);
}
