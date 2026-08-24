import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schema } from './schema';

export function createAdapter() {
  return new LokiJSAdapter({
    schema,
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
