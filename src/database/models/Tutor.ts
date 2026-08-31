import { Model, Query, Relation } from '@nozbe/watermelondb';
import { text, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import type Pet from './Pet';
import type Veterinario from './Veterinario';

export default class Tutor extends Model {
  static table = 'tutores';

  static associations = {
    veterinarios: { type: 'belongs_to' as const, key: 'veterinario_id' },
    pets: { type: 'has_many' as const, foreignKey: 'tutor_id' },
  };

  @text('veterinario_id') veterinarioId!: string;
  @text('nome_completo') nomeCompleto!: string;
  @text('cpf') cpf!: string;
  @date('data_nascimento') dataNascimento!: Date | null;
  @text('email') email!: string | null;
  @text('cep') cep!: string | null;
  @text('endereco') endereco!: string | null;
  @text('numero') numero!: string | null;
  @text('bairro') bairro!: string | null;
  @text('complemento') complemento!: string | null;
  @text('cidade') cidade!: string | null;
  @text('uf') uf!: string | null;
  @text('telefone1') telefone1!: string | null;
  @text('telefone2') telefone2!: string | null;
  @text('avatar_url') avatarUrl!: string | null;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('veterinarios', 'veterinario_id') veterinario!: Relation<Veterinario>;
  @children('pets') pets!: Query<Pet>;
}
