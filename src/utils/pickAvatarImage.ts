import * as DocumentPicker from 'expo-document-picker';

export interface PickedAvatar {
  uri: string;
  fileName: string;
  mimeType?: string;
}

/** Opens the OS file/photo picker restricted to images. Returns null if the user cancels. */
export async function pickAvatarImage(): Promise<PickedAvatar | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'image/*',
    multiple: false,
    copyToCacheDirectory: true,
  });

  if (result.canceled || result.assets.length === 0) return null;

  const asset = result.assets[0];
  return { uri: asset.uri, fileName: asset.name, mimeType: asset.mimeType };
}
