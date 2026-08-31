import { Model, Query } from '@nozbe/watermelondb';
import { text, date, readonly, children } from '@nozbe/watermelondb/decorators';
import type Prontuario from './Prontuario';
import type Tutor from './Tutor';

export default class Veterinario extends Model {
  static table = 'veterinarios';

  static associations = {
    tutores: { type: 'has_many' as const, foreignKey: 'veterinario_id' },
    prontuarios: { type: 'has_many' as const, foreignKey: 'veterinario_id' },
  };

  @text('nome') nome!: string;
  @text('crmv') crmv!: string | null;
  @text('email') email!: string;
  @text('senha_hash') senhaHash!: string;
  @text('telefone') telefone!: string | null;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('tutores') tutores!: Query<Tutor>;
  @children('prontuarios') prontuarios!: Query<Prontuario>;
}
