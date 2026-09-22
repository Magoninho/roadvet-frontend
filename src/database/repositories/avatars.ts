import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const AVATARES_DIR = `${FileSystem.documentDirectory}avatares/`;

async function ensureDirExists(): Promise<void> {
  const info = await FileSystem.getInfoAsync(AVATARES_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(AVATARES_DIR, { intermediates: true });
  }
}

/**
 * expo-document-picker returns files under the cache directory, which the OS can
 * clear at any time. Copies the picked file into a permanent app-storage folder
 * so the avatarUrl stays valid for the record's lifetime. No-op on web, where
 * picked files are already served from stable blob/object URLs.
 */
export async function persistAvatarFile(pickedUri: string, fileName: string): Promise<string> {
  if (Platform.OS === 'web') {
    return pickedUri;
  }

  await ensureDirExists();
  const destination = `${AVATARES_DIR}${Date.now()}-${fileName}`;
  await FileSystem.copyAsync({ from: pickedUri, to: destination });
  return destination;
}

export async function deleteAvatarFile(uri: string | null | undefined): Promise<void> {
  if (!uri || Platform.OS === 'web' || !uri.startsWith(FileSystem.documentDirectory ?? '')) {
    return;
  }

  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (error) {
    console.warn('[avatars] Falha ao remover arquivo:', error);
  }
}
