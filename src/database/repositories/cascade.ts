import type { Model } from '@nozbe/watermelondb';
import { database } from '../index';
import Tutor from '../models/Tutor';
import Pet from '../models/Pet';
import Prontuario from '../models/Prontuario';
import AnexoProntuario from '../models/AnexoProntuario';
import { deleteLocalFile } from './localFileStorage';

/**
 * Deleting a record also deletes everything that hangs off it:
 * tutor -> pets -> prontuarios -> anexos_prontuario, plus their avatar and attachment files.
 * Every affected row is marked as deleted individually, so the sync push already carries one
 * deleted id per row and the backend never re-implements the cascade (PLANO_BACKEND_DJANGO.md, 3.5).
 */

interface DeletionPlan {
  records: Model[];
  files: string[];
}

/** How many dependent records a deletion takes with it, for the confirmation dialog. */
export interface DeletionImpact {
  pets: number;
  prontuarios: number;
  anexos: number;
}

function planRecord(record: Model, ...files: (string | null | undefined)[]): DeletionPlan {
  return { records: [record], files: files.filter((file): file is string => !!file) };
}

function mergePlans(plans: DeletionPlan[]): DeletionPlan {
  return {
    records: plans.flatMap((plan) => plan.records),
    files: plans.flatMap((plan) => plan.files),
  };
}

function planAnexo(anexo: AnexoProntuario): DeletionPlan {
  return planRecord(anexo, anexo.uri);
}

async function planProntuario(prontuario: Prontuario): Promise<DeletionPlan> {
  const anexos = await prontuario.anexos.fetch();
  return mergePlans([...anexos.map(planAnexo), planRecord(prontuario)]);
}

async function planPet(pet: Pet): Promise<DeletionPlan> {
  const prontuarios = await pet.prontuarios.fetch();
  const children = await Promise.all(prontuarios.map(planProntuario));
  return mergePlans([...children, planRecord(pet, pet.avatarUrl)]);
}

async function planTutor(tutor: Tutor): Promise<DeletionPlan> {
  const pets = await tutor.pets.fetch();
  const children = await Promise.all(pets.map(planPet));
  return mergePlans([...children, planRecord(tutor, tutor.avatarUrl)]);
}

async function executePlan(buildPlan: () => Promise<DeletionPlan>): Promise<void> {
  // Planned inside the writer so a child created meanwhile can't be left orphaned, and committed
  // as a single batch so a failure never leaves the cascade half applied.
  const { files } = await database.write(async () => {
    const plan = await buildPlan();
    await database.batch(plan.records.map((record) => record.prepareMarkAsDeleted()));
    return plan;
  });

  // Files go only after the rows are gone: had the batch failed, the records would still point at them.
  await Promise.all(files.map(deleteLocalFile));
}

async function measurePlan(root: Model, buildPlan: () => Promise<DeletionPlan>): Promise<DeletionImpact> {
  const { records } = await buildPlan();
  const dependents = records.filter((record) => record !== root);
  const count = (table: string) => dependents.filter((record) => record.table === table).length;
  return { pets: count('pets'), prontuarios: count('prontuarios'), anexos: count('anexos_prontuario') };
}

export const deleteAnexo = (anexo: AnexoProntuario) => executePlan(async () => planAnexo(anexo));
export const deleteProntuario = (prontuario: Prontuario) => executePlan(() => planProntuario(prontuario));
export const deletePet = (pet: Pet) => executePlan(() => planPet(pet));
export const deleteTutor = (tutor: Tutor) => executePlan(() => planTutor(tutor));

export const measureProntuarioDeletion = (prontuario: Prontuario) =>
  measurePlan(prontuario, () => planProntuario(prontuario));
export const measurePetDeletion = (pet: Pet) => measurePlan(pet, () => planPet(pet));
export const measureTutorDeletion = (tutor: Tutor) => measurePlan(tutor, () => planTutor(tutor));
