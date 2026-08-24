import { Model, Relation } from '@nozbe/watermelondb';
import { text, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import type Prontuario from './Prontuario';

export type AnexoFileType = 'request' | 'result';

export default class AnexoProntuario extends Model {
  static table = 'anexos_prontuario';

  static associations = {
    prontuarios: { type: 'belongs_to' as const, key: 'prontuario_id' },
  };

  @text('prontuario_id') prontuarioId!: string;
  @text('file_type') fileType!: AnexoFileType;
  @text('file_name') fileName!: string;
  @text('uri') uri!: string;
  @text('mime_type') mimeType!: string | null;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('prontuarios', 'prontuario_id') prontuario!: Relation<Prontuario>;
}
