import { deleteLocalFile, persistPickedFile } from './localFileStorage';

/**
 * Persists a just-picked attachment file so it outlives the picker's
 * transient URI, until `uploadPendingAttachments`
 * (src/database/sync/attachmentUpload.ts) uploads it to the cloud on the
 * next online sync cycle.
 */
export function persistAttachmentFile(pickedUri: string, fileName: string): Promise<string> {
  return persistPickedFile(pickedUri, fileName, 'anexos');
}

export function deleteAttachmentFile(uri: string | null | undefined): Promise<void> {
  return deleteLocalFile(uri);
}
