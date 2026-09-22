import { deleteLocalFile, persistPickedFile } from './localFileStorage';

/**
 * Persists a just-picked avatar image so it outlives the picker's transient
 * URI, until `uploadPendingAvatars` (src/database/sync/avatarUpload.ts)
 * uploads it to the cloud on the next online sync cycle.
 */
export function persistAvatarFile(pickedUri: string, fileName: string): Promise<string> {
  return persistPickedFile(pickedUri, fileName, 'avatares');
}

export function deleteAvatarFile(uri: string | null | undefined): Promise<void> {
  return deleteLocalFile(uri);
}
