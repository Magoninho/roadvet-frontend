import Tutor from '../models/Tutor';
import Pet from '../models/Pet';
import Prontuario from '../models/Prontuario';
import AnexoProntuario from '../models/AnexoProntuario';
import { deleteAttachmentFile } from './attachments';
import { deleteAvatarFile } from './avatars';

/**
 * These assume they're already running inside an active `database.write()` action
 * (Model.markAsDeleted only requires *some* writer to be active, not its own).
 */

export async function deleteAnexo(anexo: AnexoProntuario): Promise<void> {
  await deleteAttachmentFile(anexo.uri);
  await anexo.markAsDeleted();
}

export async function deleteProntuario(prontuario: Prontuario): Promise<void> {
  const anexos = await prontuario.anexos.fetch();
  await Promise.all(anexos.map(deleteAnexo));
  await prontuario.markAsDeleted();
}

export async function deletePet(pet: Pet): Promise<void> {
  const prontuarios = await pet.prontuarios.fetch();
  await Promise.all(prontuarios.map(deleteProntuario));
  await deleteAvatarFile(pet.avatarUrl);
  await pet.markAsDeleted();
}

export async function deleteTutor(tutor: Tutor): Promise<void> {
  const pets = await tutor.pets.fetch();
  await Promise.all(pets.map(deletePet));
  await deleteAvatarFile(tutor.avatarUrl);
  await tutor.markAsDeleted();
}
