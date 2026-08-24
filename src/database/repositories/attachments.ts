import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const ANEXOS_DIR = `${FileSystem.documentDirectory}anexos/`;

async function ensureDirExists(): Promise<void> {
  const info = await FileSystem.getInfoAsync(ANEXOS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(ANEXOS_DIR, { intermediates: true });
  }
}

/**
 * expo-document-picker returns files under the cache directory, which the OS can
 * clear at any time. Copies the picked file into a permanent app-storage folder
 * so the anexo's `uri` stays valid for the record's lifetime. No-op on web, where
 * picked files are already served from stable blob/object URLs.
 */
export async function persistAttachmentFile(pickedUri: string, fileName: string): Promise<string> {
  if (Platform.OS === 'web') {
    return pickedUri;
  }

  await ensureDirExists();
  const destination = `${ANEXOS_DIR}${Date.now()}-${fileName}`;
  await FileSystem.copyAsync({ from: pickedUri, to: destination });
  return destination;
}

export async function deleteAttachmentFile(uri: string): Promise<void> {
  if (Platform.OS === 'web' || !uri.startsWith(FileSystem.documentDirectory ?? '')) {
    return;
  }

  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (error) {
    console.warn('[attachments] Falha ao remover arquivo:', error);
  }
}
