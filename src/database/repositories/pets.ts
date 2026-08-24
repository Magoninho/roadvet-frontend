import { Q } from '@nozbe/watermelondb';
import { database } from '../index';
import Pet from '../models/Pet';
import { deletePet as cascadeDeletePet } from './cascade';

export interface PetInput {
  nome: string;
  dataNascimento?: Date | null;
  peso?: string | null;
  especie: string;
  raca?: string | null;
  avatarUrl?: string | null;
}

const petsCollection = () => database.get<Pet>('pets');

function applyPetInput(pet: Pet, input: Partial<PetInput>) {
  if (input.nome !== undefined) pet.nome = input.nome;
  if (input.dataNascimento !== undefined) pet.dataNascimento = input.dataNascimento ?? null;
  if (input.peso !== undefined) pet.peso = input.peso ?? null;
  if (input.especie !== undefined) pet.especie = input.especie;
  if (input.raca !== undefined) pet.raca = input.raca ?? null;
  if (input.avatarUrl !== undefined) pet.avatarUrl = input.avatarUrl ?? null;
}

export async function createPet(tutorId: string, input: PetInput): Promise<Pet> {
  return database.write(() =>
    petsCollection().create((pet) => {
      pet.tutorId = tutorId;
      applyPetInput(pet, input);
    }),
  );
}

export async function updatePet(pet: Pet, input: Partial<PetInput>): Promise<Pet> {
  return database.write(() => pet.update((record) => applyPetInput(record, input)));
}

export async function deletePet(pet: Pet): Promise<void> {
  // Cascades to prontuarios -> anexos_prontuario, deleting attachment files too.
  await database.write(() => cascadeDeletePet(pet));
}

export function observePetsByTutor(tutorId: string) {
  return petsCollection()
    .query(Q.where('tutor_id', tutorId), Q.sortBy('nome', Q.asc))
    .observe();
}

export function observeAllPets() {
  return petsCollection().query(Q.sortBy('nome', Q.asc)).observe();
}

export function observePet(id: string) {
  return petsCollection().findAndObserve(id);
}

export async function findPetById(id: string): Promise<Pet> {
  return petsCollection().find(id);
}
