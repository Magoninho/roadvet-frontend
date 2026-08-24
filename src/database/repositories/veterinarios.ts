import { Q } from '@nozbe/watermelondb';
import { database } from '../index';
import Veterinario from '../models/Veterinario';
import { hashPassword, verifyPassword } from './password';

export interface VeterinarioInput {
  nome: string;
  crmv?: string | null;
  email: string;
  telefone?: string | null;
}

const veterinariosCollection = () => database.get<Veterinario>('veterinarios');

export async function emailJaCadastrado(email: string): Promise<boolean> {
  const results = await veterinariosCollection().query(Q.where('email', email)).fetch();
  return results.length > 0;
}

export async function createVeterinario(input: VeterinarioInput, senha: string): Promise<Veterinario> {
  const senhaHash = await hashPassword(senha);
  return database.write(() =>
    veterinariosCollection().create((veterinario) => {
      veterinario.nome = input.nome;
      veterinario.crmv = input.crmv ?? null;
      veterinario.email = input.email;
      veterinario.senhaHash = senhaHash;
      veterinario.telefone = input.telefone ?? null;
    }),
  );
}

export async function updateVeterinario(
  veterinario: Veterinario,
  input: Partial<VeterinarioInput>,
): Promise<Veterinario> {
  return database.write(() =>
    veterinario.update((record) => {
      if (input.nome !== undefined) record.nome = input.nome;
      if (input.crmv !== undefined) record.crmv = input.crmv ?? null;
      if (input.email !== undefined) record.email = input.email;
      if (input.telefone !== undefined) record.telefone = input.telefone ?? null;
    }),
  );
}

export async function updateSenha(veterinario: Veterinario, novaSenha: string): Promise<Veterinario> {
  const senhaHash = await hashPassword(novaSenha);
  return database.write(() =>
    veterinario.update((record) => {
      record.senhaHash = senhaHash;
    }),
  );
}

/** Returns the matching Veterinario when email/senha are valid, otherwise null. */
export async function authenticateVeterinario(email: string, senha: string): Promise<Veterinario | null> {
  const results = await veterinariosCollection().query(Q.where('email', email)).fetch();
  for (const veterinario of results) {
    if (await verifyPassword(senha, veterinario.senhaHash)) {
      return veterinario;
    }
  }
  return null;
}

export function observeVeterinarios() {
  return veterinariosCollection().query(Q.sortBy('nome', Q.asc)).observe();
}

export async function findVeterinarioById(id: string): Promise<Veterinario> {
  return veterinariosCollection().find(id);
}
