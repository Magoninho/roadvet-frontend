import { Database } from '@nozbe/watermelondb';
import { createAdapter } from './adapter';
import { modelClasses } from './models';

export const database = new Database({
  adapter: createAdapter(),
  modelClasses,
});
