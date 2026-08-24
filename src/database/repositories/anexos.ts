import { Q } from '@nozbe/watermelondb';
import { database } from '../index';
import AnexoProntuario, { AnexoFileType } from '../models/AnexoProntuario';
import { deleteAnexo as cascadeDeleteAnexo } from './cascade';
import { persistAttachmentFile } from './attachments';

export interface AnexoInput {
  fileType: AnexoFileType;
  fileName: string;
  uri: string;
  mimeType?: string | null;
}

const anexosCollection = () => database.get<AnexoProntuario>('anexos_prontuario');

export async function createAnexo(prontuarioId: string, input: AnexoInput): Promise<AnexoProntuario> {
  const uri = await persistAttachmentFile(input.uri, input.fileName);
  return database.write(() =>
    anexosCollection().create((anexo) => {
      anexo.prontuarioId = prontuarioId;
      anexo.fileType = input.fileType;
      anexo.fileName = input.fileName;
      anexo.uri = uri;
      anexo.mimeType = input.mimeType ?? null;
    }),
  );
}

export async function deleteAnexo(anexo: AnexoProntuario): Promise<void> {
  await database.write(() => cascadeDeleteAnexo(anexo));
}

export function observeAnexosByProntuario(prontuarioId: string) {
  return anexosCollection()
    .query(Q.where('prontuario_id', prontuarioId), Q.sortBy('created_at', Q.asc))
    .observe();
}

export function observeAnexosByProntuarioAndType(prontuarioId: string, fileType: AnexoFileType) {
  return anexosCollection()
    .query(
      Q.where('prontuario_id', prontuarioId),
      Q.where('file_type', fileType),
      Q.sortBy('created_at', Q.asc),
    )
    .observe();
}
