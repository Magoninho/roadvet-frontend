import { TutorModel } from './types';

export interface ITutorRepository {
  getAll(): Promise<TutorModel[]>;
  getById(id: string): Promise<TutorModel | null>;
  searchByName(query: string): Promise<TutorModel[]>;
  create(tutor: Omit<TutorModel, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>): Promise<TutorModel>;
  update(id: string, tutor: Partial<TutorModel>): Promise<TutorModel>;
  delete(id: string): Promise<void>;
}
