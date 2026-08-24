import * as Crypto from 'expo-crypto';

/**
 * Local-only credential check for offline field use — there is no backend yet.
 * A per-password random salt (stored alongside the hash, colon-separated) keeps
 * identical passwords from producing identical hashes.
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = Crypto.randomUUID();
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${plainText}`);
  return `${salt}:${digest}`;
}

export async function verifyPassword(plainText: string, storedHash: string): Promise<boolean> {
  const [salt] = storedHash.split(':');
  if (!salt) return false;
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${plainText}`);
  return `${salt}:${digest}` === storedHash;
}
