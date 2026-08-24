import { Q } from '@nozbe/watermelondb';
import { database } from '../index';
import Tutor from '../models/Tutor';
import { deleteTutor as cascadeDeleteTutor } from './cascade';

export interface TutorInput {
  nomeCompleto: string;
  cpf: string;
  dataNascimento?: Date | null;
  email?: string | null;
  cep?: string | null;
  endereco?: string | null;
  numero?: string | null;
  bairro?: string | null;
  complemento?: string | null;
  cidade?: string | null;
  uf?: string | null;
  telefone1?: string | null;
  telefone2?: string | null;
  avatarUrl?: string | null;
}

const tutoresCollection = () => database.get<Tutor>('tutores');

function applyTutorInput(tutor: Tutor, input: Partial<TutorInput>) {
  if (input.nomeCompleto !== undefined) tutor.nomeCompleto = input.nomeCompleto;
  if (input.cpf !== undefined) tutor.cpf = input.cpf;
  if (input.dataNascimento !== undefined) tutor.dataNascimento = input.dataNascimento ?? null;
  if (input.email !== undefined) tutor.email = input.email ?? null;
  if (input.cep !== undefined) tutor.cep = input.cep ?? null;
  if (input.endereco !== undefined) tutor.endereco = input.endereco ?? null;
  if (input.numero !== undefined) tutor.numero = input.numero ?? null;
  if (input.bairro !== undefined) tutor.bairro = input.bairro ?? null;
  if (input.complemento !== undefined) tutor.complemento = input.complemento ?? null;
  if (input.cidade !== undefined) tutor.cidade = input.cidade ?? null;
  if (input.uf !== undefined) tutor.uf = input.uf ?? null;
  if (input.telefone1 !== undefined) tutor.telefone1 = input.telefone1 ?? null;
  if (input.telefone2 !== undefined) tutor.telefone2 = input.telefone2 ?? null;
  if (input.avatarUrl !== undefined) tutor.avatarUrl = input.avatarUrl ?? null;
}

export async function createTutor(input: TutorInput): Promise<Tutor> {
  return database.write(() => tutoresCollection().create((tutor) => applyTutorInput(tutor, input)));
}

export async function updateTutor(tutor: Tutor, input: Partial<TutorInput>): Promise<Tutor> {
  return database.write(() => tutor.update((record) => applyTutorInput(record, input)));
}

export async function deleteTutor(tutor: Tutor): Promise<void> {
  // Cascades to pets -> prontuarios -> anexos_prontuario, deleting attachment files too.
  await database.write(() => cascadeDeleteTutor(tutor));
}

export function observeTutores() {
  return tutoresCollection()
    .query(Q.sortBy('nome_completo', Q.asc))
    .observe();
}

export function observeTutoresWhereNome(search: string) {
  return tutoresCollection()
    .query(Q.where('nome_completo', Q.like(`%${Q.sanitizeLikeString(search)}%`)), Q.sortBy('nome_completo', Q.asc))
    .observe();
}

export function observeTutor(id: string) {
  return tutoresCollection().findAndObserve(id);
}

export async function findTutorById(id: string): Promise<Tutor> {
  return tutoresCollection().find(id);
}
