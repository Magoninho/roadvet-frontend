import { Q } from '@nozbe/watermelondb';
import { database } from '@/database';
import Tutor from '@/database/models/Tutor';
import Pet from '@/database/models/Pet';
import { apiUpload } from '@/services/api/client';

function isRemoteUri(uri: string): boolean {
  return uri.startsWith('http://') || uri.startsWith('https://');
}

/** Recovers a filename + MIME type from a local `data:`/`file://` uri, since neither the Tutor nor Pet table stores them separately. */
function inferUploadMeta(uri: string, recordId: string): { name: string; type: string } {
  const dataUrlMatch = /^data:([^;]+);base64,/.exec(uri);
  if (dataUrlMatch) {
    const type = dataUrlMatch[1];
    const ext = type.split('/')[1] ?? 'bin';
    return { name: `avatar-${recordId}.${ext}`, type };
  }

  const name = uri.split('/').pop() || `avatar-${recordId}`;
  const ext = name.split('.').pop()?.toLowerCase();
  const type = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream';
  return { name, type };
}

async function findPendingTutorAvatars(veterinarioId: string): Promise<Tutor[]> {
  const tutores = await database
    .get<Tutor>('tutores')
    .query(Q.where('veterinario_id', veterinarioId))
    .fetch();
  return tutores.filter((tutor) => !!tutor.avatarUrl && !isRemoteUri(tutor.avatarUrl));
}

async function findPendingPetAvatars(veterinarioId: string): Promise<Pet[]> {
  const pets = await database
    .get<Pet>('pets')
    .query(Q.on('tutores', 'veterinario_id', veterinarioId))
    .fetch();
  return pets.filter((pet) => !!pet.avatarUrl && !isRemoteUri(pet.avatarUrl));
}

let uploadPromise: Promise<void> | null = null;

/**
 * Sends the image file for every tutor/pet whose metadata was already
 * synced but whose `avatarUrl` is still a local device path or web `data:`
 * URL. Safe to call repeatedly -- concurrent calls share the in-flight run.
 * Failures are per-record and non-fatal; a record left with a local
 * avatarUrl is simply retried on the next call.
 */
export function uploadPendingAvatars(veterinarioId: string): Promise<void> {
  if (uploadPromise) return uploadPromise;

  uploadPromise = (async () => {
    const [tutores, pets] = await Promise.all([
      findPendingTutorAvatars(veterinarioId),
      findPendingPetAvatars(veterinarioId),
    ]);

    for (const tutor of tutores) {
      try {
        const meta = inferUploadMeta(tutor.avatarUrl!, tutor.id);
        const result = await apiUpload<{ avatar_url: string }>(`/tutors/${tutor.id}/avatar`, {
          uri: tutor.avatarUrl!,
          ...meta,
        });
        await database.write(() =>
          tutor.update((record) => {
            record.avatarUrl = result.avatar_url;
          }),
        );
      } catch {
        // Leave it pending; the next sync cycle retries.
      }
    }

    for (const pet of pets) {
      try {
        const meta = inferUploadMeta(pet.avatarUrl!, pet.id);
        const result = await apiUpload<{ avatar_url: string }>(`/pets/${pet.id}/avatar`, {
          uri: pet.avatarUrl!,
          ...meta,
        });
        await database.write(() =>
          pet.update((record) => {
            record.avatarUrl = result.avatar_url;
          }),
        );
      } catch {
        // Leave it pending; the next sync cycle retries.
      }
    }
  })().finally(() => {
    uploadPromise = null;
  });

  return uploadPromise;
}
