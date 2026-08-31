import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { migrations } from './migrations';

export function createAdapter() {
  return new SQLiteAdapter({
    schema,
    migrations,
    jsi: true,
    onSetUpError: (error) => {
      console.error('[database] Falha ao inicializar o banco nativo:', error);
    },
  });
}
