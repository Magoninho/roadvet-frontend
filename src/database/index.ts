import { Database } from '@nozbe/watermelondb';
import { createAdapter } from './adapter';
import { modelClasses } from './models';

export const database = new Database({
  adapter: createAdapter(),
  modelClasses,
});

/**
 * Resets the entire local WatermelonDB database and clears collection caches.
 * Used when logging out or switching authenticated users.
 */
export async function resetDatabase(): Promise<void> {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
}

