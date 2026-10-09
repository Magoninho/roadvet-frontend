import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

/**
 * Converts a picked file into a base64 `data:` URL. Unlike the `blob:`
 * object URL that `expo-document-picker` hands back on web, a `data:` URL
 * embeds the file's bytes directly in the string, so it survives page
 * reloads (a `blob:` URL only resolves for the lifetime of the page that
 * created it, so it went dangling after a reload -- see the bug this fixes).
 * It's also a universally valid URI: it works as-is with `<Image>`,
 * `fetch()`, and `Linking.openURL`, unlike a custom scheme would.
 */
function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  return fetch(blobUrl)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(reader.error);
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        }),
    );
}

async function ensureDirExists(dir: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

/**
 * Persists a just-picked file so its reference outlives the picker's
 * transient URI, until it can be uploaded to the cloud (see
 * `src/database/sync/attachmentUpload.ts` / `avatarUpload.ts`). Native:
 * copies into a permanent app-storage folder under `documentDirectory`,
 * which survives app restarts. Web: inlines the bytes as a `data:` URL (see
 * `blobUrlToDataUrl` above) -- there's no persistent arbitrary-path
 * filesystem on the web, so the local "file" IS the string stored in
 * WatermelonDB. Note this makes the record's field larger until the
 * upload (triggered on the very next sync cycle when online) replaces it
 * with a short remote URL.
 */
export async function persistPickedFile(pickedUri: string, fileName: string, nativeSubdir: string): Promise<string> {
  if (Platform.OS === 'web') {
    return blobUrlToDataUrl(pickedUri);
  }

  const dir = `${FileSystem.documentDirectory}${nativeSubdir}/`;
  await ensureDirExists(dir);
  const destination = `${dir}${Date.now()}-${fileName}`;
  await FileSystem.copyAsync({ from: pickedUri, to: destination });
  return destination;
}

/** Deletes a locally-persisted file. No-op for remote URLs, web `data:` URLs (nothing external to clean up), or anything outside our own storage folder. */
export async function deleteLocalFile(uri: string | null | undefined): Promise<void> {
  if (!uri || Platform.OS === 'web' || !uri.startsWith(FileSystem.documentDirectory ?? '')) {
    return;
  }

  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (error) {
    console.warn('[localFileStorage] Falha ao remover arquivo:', error);
  }
}

/**
 * Removes all cached native files in application subdirectories (e.g. anexos, avatares).
 * Used during logout or when switching accounts to prevent data leakage between users.
 */
export async function cleanupAllLocalFiles(): Promise<void> {
  if (Platform.OS === 'web' || !FileSystem.documentDirectory) {
    return;
  }

  try {
    for (const subdir of ['anexos', 'avatares']) {
      const dir = `${FileSystem.documentDirectory}${subdir}/`;
      const info = await FileSystem.getInfoAsync(dir);
      if (info.exists) {
        await FileSystem.deleteAsync(dir, { idempotent: true });
      }
    }
  } catch (error) {
    console.warn('[localFileStorage] Falha ao limpar arquivos locais:', error);
  }
}

