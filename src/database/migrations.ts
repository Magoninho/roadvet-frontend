import { addColumns, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'tutores',
          columns: [{ name: 'veterinario_id', type: 'string', isIndexed: true }],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: 'prontuarios',
          columns: [{ name: 'vaccines', type: 'string', isOptional: true }],
        }),
      ],
    },
  ],
});
