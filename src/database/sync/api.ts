import { apiRequest } from '@/services/api/client';
import type { DirtyRaw, SyncPullArgs, SyncPullResult, SyncPushArgs, SyncPushResult } from '@nozbe/watermelondb/sync';

export async function pullChanges({ lastPulledAt }: SyncPullArgs): Promise<SyncPullResult> {
  const tutors = await apiRequest<any[]>('/api/tutors/', {
    method: 'GET',
  });

  const updatedTutores = tutors.map((tutor) => ({
  id: String(tutor.id),
  nome_completo: tutor.full_name || '',
  cpf: tutor.cpf,
  email: tutor.email,
  telefone: tutor.phone_1,
  avatar_url: tutor.photo || null,
  created_at: tutor.created_at ? new Date(tutor.created_at).getTime() : Date.now(),
  updated_at: tutor.updated_at ? new Date(tutor.updated_at).getTime() : Date.now(),
}));

  return {
    changes: {
      tutores: {
        created: [],
        updated: updatedTutores as DirtyRaw[],
        deleted: [],
      },
    },
    timestamp: Date.now(),
  };
}

export async function pushChanges({ changes }: SyncPushArgs): Promise<SyncPushResult | undefined> {
  return undefined;
}