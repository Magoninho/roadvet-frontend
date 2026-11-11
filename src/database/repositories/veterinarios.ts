import { Q } from '@nozbe/watermelondb';
import * as Crypto from 'expo-crypto';
import { database } from '../index';
import Veterinario from '../models/Veterinario';
import { hashPassword, verifyPassword } from './password';

export interface VeterinarioInput {
  nome: string;
  crmv?: string | null;
  email: string;
  telefone?: string | null;
  avatarUrl?: string | null;
}

export interface RemoteVeterinarioProfile {
  id: string;
  nome: string;
  crmv?: string | null;
  email: string;
  telefone?: string | null;
  avatar_url?: string | null;
}

/** True for a URL already hosted by the API, false for a local file/`data:` URI still waiting for upload. */
export function isRemoteAvatarUri(uri: string): boolean {
  return uri.startsWith('http://') || uri.startsWith('https://');
}

const veterinariosCollection = () => database.get<Veterinario>('veterinarios');

/** A 32-char alphanumeric id, safe as a WatermelonDB row id and within the backend's CharField(max_length=32). */
export function generateVeterinarioId(): string {
  return Crypto.randomUUID().replace(/-/g, '');
}

export async function emailJaCadastrado(email: string): Promise<boolean> {
  const results = await veterinariosCollection().query(Q.where('email', email)).fetch();
  return results.length > 0;
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
      if (input.avatarUrl !== undefined) record.avatarUrl = input.avatarUrl ?? null;
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

export function observeVeterinario(id: string) {
  return veterinariosCollection().findAndObserve(id);
}

export async function findVeterinarioById(id: string): Promise<Veterinario> {
  return veterinariosCollection().find(id);
}

/**
 * Ensures the authenticated vet's own row exists locally with the fields
 * the backend just confirmed, WITHOUT going through synchronizeDatabase().
 *
 * This must run before the first synchronizeDatabase() call after
 * login/register: the backend always reports this table's row as 'updated'
 * (see the Django sync view), which requires WatermelonDB to already have
 * it locally — if it didn't exist yet the pull would fail just as it would
 * if the backend instead reported it as 'created' for an id the client
 * already has.
 *
 * `senhaHash`, when provided (registration), seeds the local hash used by
 * the offline-login fallback; omitted on login so an already-correct local
 * hash from a prior registration/sync isn't clobbered with a blank one.
 */
export async function upsertVeterinarioFromRemote(
  profile: RemoteVeterinarioProfile,
  senhaHash?: string,
): Promise<Veterinario> {
  const collection = veterinariosCollection();

  let existing: Veterinario | null = null;
  try {
    existing = await collection.find(profile.id);
  } catch {
    existing = null;
  }

  if (existing) {
    const record = existing;
    return database.write(() =>
      record.update((r) => {
        r.nome = profile.nome;
        r.crmv = profile.crmv ?? null;
        r.email = profile.email;
        r.telefone = profile.telefone ?? null;
        // Keep a locally picked photo that is still waiting for upload; otherwise trust the server.
        const hasPendingAvatar = !!r.avatarUrl && !isRemoteAvatarUri(r.avatarUrl);
        if (profile.avatar_url !== undefined && !hasPendingAvatar) r.avatarUrl = profile.avatar_url ?? null;
        if (senhaHash) r.senhaHash = senhaHash;
      }),
    );
  }

  const now = Date.now();
  return database.write(async () => {
    const created = collection.prepareCreateFromDirtyRaw({
      id: profile.id,
      nome: profile.nome,
      crmv: profile.crmv ?? null,
      email: profile.email,
      senha_hash: senhaHash ?? '',
      telefone: profile.telefone ?? null,
      avatar_url: profile.avatar_url ?? null,
      created_at: now,
      updated_at: now,
    }) as Veterinario;
    await database.batch(created);
    return created;
  });
}
