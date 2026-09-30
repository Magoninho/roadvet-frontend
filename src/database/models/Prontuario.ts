import { Model, Query, Relation } from '@nozbe/watermelondb';
import { text, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import type Pet from './Pet';
import type Veterinario from './Veterinario';
import type AnexoProntuario from './AnexoProntuario';

export default class Prontuario extends Model {
  static table = 'prontuarios';

  static associations = {
    pets: { type: 'belongs_to' as const, key: 'pet_id' },
    veterinarios: { type: 'belongs_to' as const, key: 'veterinario_id' },
    anexos_prontuario: { type: 'has_many' as const, foreignKey: 'prontuario_id' },
  };

  @text('pet_id') petId!: string;
  @text('veterinario_id') veterinarioId!: string;
  @date('date') date!: Date;
  @text('weight') weight!: string | null;
  @text('temperature') temperature!: string | null;
  @text('heart_rate') heartRate!: string | null;
  @text('anamnesis') anamnesis!: string | null;
  @text('physical_exam') physicalExam!: string | null;
  @text('prescription') prescription!: string | null;
  @text('vaccines') vaccines!: string | null;
  @text('exam_request_notes') examRequestNotes!: string | null;
  @text('exam_results_notes') examResultsNotes!: string | null;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('pets', 'pet_id') pet!: Relation<Pet>;
  @relation('veterinarios', 'veterinario_id') veterinario!: Relation<Veterinario>;
  @children('anexos_prontuario') anexos!: Query<AnexoProntuario>;
}
