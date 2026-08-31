import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schema } from './schema';
import { migrations } from './migrations';

export function createAdapter() {
  return new LokiJSAdapter({
    schema,
    migrations,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    onQuotaExceededError: (error) => {
      console.warn('[database] Cota de armazenamento do navegador excedida:', error);
    },
    onSetUpError: (error) => {
      console.error('[database] Falha ao inicializar o banco no navegador:', error);
    },
  });
}
