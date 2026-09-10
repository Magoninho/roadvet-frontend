import { Q } from '@nozbe/watermelondb';
import { database } from '@/database';
import AnexoProntuario from '@/database/models/AnexoProntuario';
import { apiUpload } from '@/services/api/client';

const anexosCollection = () => database.get<AnexoProntuario>('anexos_prontuario');

function isRemoteUri(uri: string): boolean {
  return uri.startsWith('http://') || uri.startsWith('https://');
}

async function findPendingUploads(veterinarioId: string): Promise<AnexoProntuario[]> {
  const anexos = await anexosCollection()
    .query(Q.on('prontuarios', 'veterinario_id', veterinarioId))
    .fetch();
  return anexos.filter((anexo) => !isRemoteUri(anexo.uri));
}

let uploadPromise: Promise<void> | null = null;

/**
 * Sends the binary file for every anexo whose metadata was already synced
 * (see PLANO_BACKEND_DJANGO.md section 8) but whose `uri` is still a local
 * device path. Safe to call repeatedly — concurrent calls share the
 * in-flight run. Failures are per-file and non-fatal; a file left with a
 * local uri is simply retried on the next call.
 */
export function uploadPendingAttachments(veterinarioId: string): Promise<void> {
  if (uploadPromise) return uploadPromise;

  uploadPromise = (async () => {
    const pending = await findPendingUploads(veterinarioId);
    for (const anexo of pending) {
      try {
        const result = await apiUpload<{ uri: string }>(`/anexos/${anexo.id}/upload`, {
          uri: anexo.uri,
          name: anexo.fileName,
          type: anexo.mimeType ?? undefined,
        });
        await database.write(() =>
          anexo.update((record) => {
            record.uri = result.uri;
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
