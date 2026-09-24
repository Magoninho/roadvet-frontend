import { combineLatest, map, type Observable } from 'rxjs';
import { buildSearchIndex } from '@/utils/search';
import { formatDateBR } from '@/utils/format';
import Pet from '../models/Pet';
import Prontuario from '../models/Prontuario';
import Tutor from '../models/Tutor';
import { observePetsByVeterinario } from './pets';
import { observeProntuariosByVeterinario } from './prontuarios';
import { observeTutores } from './tutores';

/**
 * List-screen queries that resolve each record's relations up front and precompute
 * its search haystack.
 *
 * The per-card `relation.observe()` these replace opened one subscription per
 * visible row and could not be searched against, because the related name only
 * existed inside the card. Joining once per list keeps it to a handful of
 * subscriptions and makes the tutor/pet name searchable.
 */

export interface TutorRow {
  id: string;
  tutor: Tutor;
  pets: Pet[];
  searchIndex: string;
}

export interface PetRow {
  id: string;
  pet: Pet;
  tutor: Tutor | null;
  searchIndex: string;
}

export interface ProntuarioRow {
  id: string;
  prontuario: Prontuario;
  pet: Pet | null;
  tutor: Tutor | null;
  searchIndex: string;
}

function indexById<T extends { id: string }>(records: T[]): Map<string, T> {
  return new Map(records.map((record) => [record.id, record]));
}

function groupByTutor(pets: Pet[]): Map<string, Pet[]> {
  const grouped = new Map<string, Pet[]>();
  for (const pet of pets) {
    const siblings = grouped.get(pet.tutorId);
    if (siblings) siblings.push(pet);
    else grouped.set(pet.tutorId, [pet]);
  }
  return grouped;
}

/** Tutores of a veterinarian, each with their pets, searchable by name, CPF, contact, address and pet names. */
export function observeTutorRows(veterinarioId: string): Observable<TutorRow[]> {
  return combineLatest([observeTutores(veterinarioId), observePetsByVeterinario(veterinarioId)]).pipe(
    map(([tutores, pets]) => {
      const petsByTutor = groupByTutor(pets);

      return tutores.map((tutor) => {
        const tutorPets = petsByTutor.get(tutor.id) ?? [];

        return {
          id: tutor.id,
          tutor,
          pets: tutorPets,
          searchIndex: buildSearchIndex([
            tutor.nomeCompleto,
            tutor.cpf,
            tutor.email,
            tutor.telefone1,
            tutor.telefone2,
            tutor.endereco,
            tutor.bairro,
            tutor.cidade,
            tutor.uf,
            ...tutorPets.map((pet) => pet.nome),
          ]),
        };
      });
    }),
  );
}

/** Pets of a veterinarian, each with its tutor, searchable by pet data or by the tutor's name, CPF and phone. */
export function observePetRows(veterinarioId: string): Observable<PetRow[]> {
  return combineLatest([observePetsByVeterinario(veterinarioId), observeTutores(veterinarioId)]).pipe(
    map(([pets, tutores]) => {
      const tutorById = indexById(tutores);

      return pets.map((pet) => {
        const tutor = tutorById.get(pet.tutorId) ?? null;

        return {
          id: pet.id,
          pet,
          tutor,
          searchIndex: buildSearchIndex([
            pet.nome,
            pet.especie,
            pet.raca,
            tutor?.nomeCompleto,
            tutor?.cpf,
            tutor?.telefone1,
          ]),
        };
      });
    }),
  );
}

/** Prontuários of a veterinarian, searchable by pet, tutor, consultation date and every clinical note. */
export function observeProntuarioRows(veterinarioId: string): Observable<ProntuarioRow[]> {
  return combineLatest([
    observeProntuariosByVeterinario(veterinarioId),
    observePetsByVeterinario(veterinarioId),
    observeTutores(veterinarioId),
  ]).pipe(
    map(([prontuarios, pets, tutores]) => {
      const petById = indexById(pets);
      const tutorById = indexById(tutores);

      return prontuarios.map((prontuario) => {
        const pet = petById.get(prontuario.petId) ?? null;
        const tutor = pet ? tutorById.get(pet.tutorId) ?? null : null;

        return {
          id: prontuario.id,
          prontuario,
          pet,
          tutor,
          searchIndex: buildSearchIndex([
            pet?.nome,
            pet?.especie,
            pet?.raca,
            tutor?.nomeCompleto,
            formatDateBR(prontuario.date),
            prontuario.anamnesis,
            prontuario.physicalExam,
            prontuario.prescription,
            prontuario.examRequestNotes,
            prontuario.examResultsNotes,
          ]),
        };
      });
    }),
  );
}
