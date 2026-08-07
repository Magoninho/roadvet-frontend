import { ProntuarioRecordModel } from './types';

export interface IProntuarioRepository {
  getAll(): Promise<ProntuarioRecordModel[]>;
  getById(id: string): Promise<ProntuarioRecordModel | null>;
  getByPetId(petId: string): Promise<ProntuarioRecordModel[]>;
  create(record: Omit<ProntuarioRecordModel, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>): Promise<ProntuarioRecordModel>;
  update(id: string, record: Partial<ProntuarioRecordModel>): Promise<ProntuarioRecordModel>;
  delete(id: string): Promise<void>;
}
