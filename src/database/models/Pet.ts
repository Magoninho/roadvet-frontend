import { Model, Query, Relation } from '@nozbe/watermelondb';
import { text, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import type Tutor from './Tutor';
import type Prontuario from './Prontuario';

export default class Pet extends Model {
  static table = 'pets';

  static associations = {
    tutores: { type: 'belongs_to' as const, key: 'tutor_id' },
    prontuarios: { type: 'has_many' as const, foreignKey: 'pet_id' },
  };

  @text('tutor_id') tutorId!: string;
  @text('nome') nome!: string;
  @date('data_nascimento') dataNascimento!: Date | null;
  @text('peso') peso!: string | null;
  @text('especie') especie!: string;
  @text('raca') raca!: string | null;
  @text('sexo') sexo!: string | null;
  @text('avatar_url') avatarUrl!: string | null;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('tutores', 'tutor_id') tutor!: Relation<Tutor>;
  @children('prontuarios') prontuarios!: Query<Prontuario>;
}
