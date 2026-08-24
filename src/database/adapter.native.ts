import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';

export function createAdapter() {
  return new SQLiteAdapter({
    schema,
    jsi: true,
    onSetUpError: (error) => {
      console.error('[database] Falha ao inicializar o banco nativo:', error);
    },
  });
}
