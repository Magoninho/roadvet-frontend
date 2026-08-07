import { PetModel } from './types';

export interface IPetRepository {
  getAll(): Promise<PetModel[]>;
  getById(id: string): Promise<PetModel | null>;
  getByTutorId(tutorId: string): Promise<PetModel[]>;
  searchByName(query: string): Promise<PetModel[]>;
  create(pet: Omit<PetModel, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>): Promise<PetModel>;
  update(id: string, pet: Partial<PetModel>): Promise<PetModel>;
  delete(id: string): Promise<void>;
}
