import { database } from '../index';
import Tutor from '../models/Tutor';
import Pet from '../models/Pet';
import Prontuario from '../models/Prontuario';
import AnexoProntuario from '../models/AnexoProntuario';
import { deleteAttachmentFile } from './attachments';

/**
 * Safe, atomic cascading deletion for WatermelonDB models.
 * Fetches relations up front, removes local attachment files, and executes
 * prepared deletions inside a single database.write batch.
 */

export async function deleteAnexo(anexo: AnexoProntuario): Promise<void> {
  await deleteAttachmentFile(anexo.uri);
  await database.write(async () => {
    await anexo.markAsDeleted();
  });
}

export async function deleteProntuario(prontuario: Prontuario): Promise<void> {
  const anexos = await prontuario.anexos.fetch();
  await Promise.all(anexos.map((anexo) => deleteAttachmentFile(anexo.uri)));

  await database.write(async () => {
    const preparedDeletions = [
      prontuario.prepareMarkAsDeleted(),
      ...anexos.map((a) => a.prepareMarkAsDeleted()),
    ];
    await database.batch(...preparedDeletions);
  });
}

export async function deletePet(pet: Pet): Promise<void> {
  const prontuarios = await pet.prontuarios.fetch();
  const anexosLists = await Promise.all(prontuarios.map((p) => p.anexos.fetch()));
  const allAnexos = anexosLists.flat();

  await Promise.all(allAnexos.map((anexo) => deleteAttachmentFile(anexo.uri)));

  await database.write(async () => {
    const preparedDeletions = [
      pet.prepareMarkAsDeleted(),
      ...prontuarios.map((p) => p.prepareMarkAsDeleted()),
      ...allAnexos.map((a) => a.prepareMarkAsDeleted()),
    ];
    await database.batch(...preparedDeletions);
  });
}

export async function deleteTutor(tutor: Tutor): Promise<void> {
  const pets = await tutor.pets.fetch();
  const prontuariosLists = await Promise.all(pets.map((p) => p.prontuarios.fetch()));
  const allProntuarios = prontuariosLists.flat();
  const anexosLists = await Promise.all(allProntuarios.map((p) => p.anexos.fetch()));
  const allAnexos = anexosLists.flat();

  await Promise.all(allAnexos.map((anexo) => deleteAttachmentFile(anexo.uri)));

  await database.write(async () => {
    const preparedDeletions = [
      tutor.prepareMarkAsDeleted(),
      ...pets.map((p) => p.prepareMarkAsDeleted()),
      ...allProntuarios.map((p) => p.prepareMarkAsDeleted()),
      ...allAnexos.map((a) => a.prepareMarkAsDeleted()),
    ];
    await database.batch(...preparedDeletions);
  });
}
