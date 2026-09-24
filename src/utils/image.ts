import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

/**
 * Converts a local file or blob URI to a Data URI (base64).
 * Data URIs persist through WatermelonDB sync (/api/sync) and allow
 * avatars/photos to be stored directly in Django PostgreSQL and
 * rendered on any client device.
 */
export async function convertToDataUri(uri: string, mimeType?: string): Promise<string> {
  if (!uri || uri.startsWith('data:')) {
    return uri;
  }

  const mime = mimeType || 'image/jpeg';

  if (Platform.OS === 'web') {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return uri;
    }
  }

  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:${mime};base64,${base64}`;
  } catch (error) {
    console.warn('[convertToDataUri] Falha ao converter imagem para base64:', error);
    return uri;
  }
}
