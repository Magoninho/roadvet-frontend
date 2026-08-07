/**
 * WatermelonDB AppSchema template for RoadVet.
 * 
 * When installing @watermelon-db/watermelondb, import appSchema & tableSchema:
 * import { appSchema, tableSchema } from '@watermelon-db/watermelondb';
 */

export const schemaDefinition = {
  version: 1,
  tables: [
    {
      name: 'tutores',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'cpf', type: 'string', isOptional: true },
        { name: 'address', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    },
    {
      name: 'pets',
      columns: [
        { name: 'tutor_id', type: 'string', isIndexed: true },
        { name: 'tutor_name', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'species', type: 'string' },
        { name: 'breed', type: 'string' },
        { name: 'birth_date', type: 'string', isOptional: true },
        { name: 'weight', type: 'string', isOptional: true },
        { name: 'avatar_url', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    },
    {
      name: 'prontuarios',
      columns: [
        { name: 'pet_id', type: 'string', isIndexed: true },
        { name: 'pet_name', type: 'string' },
        { name: 'tutor_name', type: 'string' },
        { name: 'date', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    },
  ],
};
