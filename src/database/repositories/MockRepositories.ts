import { ITutorRepository } from './ITutorRepository';
import { IPetRepository } from './IPetRepository';
import { IProntuarioRepository } from './IProntuarioRepository';
import { TutorModel, PetModel, ProntuarioRecordModel } from './types';

let mockTutores: TutorModel[] = [
  { id: '1', name: 'Ana Silva', phone: '(11) 98765-4321', createdAt: Date.now(), updatedAt: Date.now(), isSynced: true },
  { id: '2', name: 'Carlos Souza', phone: '(11) 91234-5678', createdAt: Date.now(), updatedAt: Date.now(), isSynced: true },
];

let mockPets: PetModel[] = [
  { id: '1', tutorId: '1', tutorName: 'Ana Silva', name: 'Thor', species: 'Cão', breed: 'Golden Retriever', weight: '28.5', createdAt: Date.now(), updatedAt: Date.now(), isSynced: true },
  { id: '2', tutorId: '2', tutorName: 'Carlos Souza', name: 'Mia', species: 'Gato', breed: 'Siamês', weight: '4.2', createdAt: Date.now(), updatedAt: Date.now(), isSynced: true },
];

let mockProntuarios: ProntuarioRecordModel[] = [
  { id: '1', petId: '1', petName: 'Thor', tutorName: 'Ana Silva', date: '07/08/2026', type: 'vaccine', title: 'Vacina V10', notes: 'Aplicação sem intercorrências', createdAt: Date.now(), updatedAt: Date.now(), isSynced: true },
  { id: '2', petId: '2', petName: 'Mia', tutorName: 'Carlos Souza', date: '05/08/2026', type: 'medication', title: 'Vermífugo', notes: 'Administrado via oral', createdAt: Date.now(), updatedAt: Date.now(), isSynced: true },
];

export class MockTutorRepository implements ITutorRepository {
  async getAll(): Promise<TutorModel[]> {
    return [...mockTutores];
  }
  async getById(id: string): Promise<TutorModel | null> {
    return mockTutores.find((t) => t.id === id) || null;
  }
  async searchByName(query: string): Promise<TutorModel[]> {
    const q = query.toLowerCase();
    return mockTutores.filter((t) => t.name.toLowerCase().includes(q));
  }
  async create(data: Omit<TutorModel, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>): Promise<TutorModel> {
    const newTutor: TutorModel = {
      ...data,
      id: String(Date.now()),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isSynced: false,
    };
    mockTutores.push(newTutor);
    return newTutor;
  }
  async update(id: string, data: Partial<TutorModel>): Promise<TutorModel> {
    const idx = mockTutores.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Tutor não encontrado');
    mockTutores[idx] = { ...mockTutores[idx], ...data, updatedAt: Date.now(), isSynced: false };
    return mockTutores[idx];
  }
  async delete(id: string): Promise<void> {
    mockTutores = mockTutores.filter((t) => t.id !== id);
  }
}

export class MockPetRepository implements IPetRepository {
  async getAll(): Promise<PetModel[]> {
    return [...mockPets];
  }
  async getById(id: string): Promise<PetModel | null> {
    return mockPets.find((p) => p.id === id) || null;
  }
  async getByTutorId(tutorId: string): Promise<PetModel[]> {
    return mockPets.filter((p) => p.tutorId === tutorId);
  }
  async searchByName(query: string): Promise<PetModel[]> {
    const q = query.toLowerCase();
    return mockPets.filter((p) => p.name.toLowerCase().includes(q));
  }
  async create(data: Omit<PetModel, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>): Promise<PetModel> {
    const newPet: PetModel = {
      ...data,
      id: String(Date.now()),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isSynced: false,
    };
    mockPets.push(newPet);
    return newPet;
  }
  async update(id: string, data: Partial<PetModel>): Promise<PetModel> {
    const idx = mockPets.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Pet não encontrado');
    mockPets[idx] = { ...mockPets[idx], ...data, updatedAt: Date.now(), isSynced: false };
    return mockPets[idx];
  }
  async delete(id: string): Promise<void> {
    mockPets = mockPets.filter((p) => p.id !== id);
  }
}

export class MockProntuarioRepository implements IProntuarioRepository {
  async getAll(): Promise<ProntuarioRecordModel[]> {
    return [...mockProntuarios];
  }
  async getById(id: string): Promise<ProntuarioRecordModel | null> {
    return mockProntuarios.find((r) => r.id === id) || null;
  }
  async getByPetId(petId: string): Promise<ProntuarioRecordModel[]> {
    return mockProntuarios.filter((r) => r.petId === petId);
  }
  async create(data: Omit<ProntuarioRecordModel, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>): Promise<ProntuarioRecordModel> {
    const newRecord: ProntuarioRecordModel = {
      ...data,
      id: String(Date.now()),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isSynced: false,
    };
    mockProntuarios.push(newRecord);
    return newRecord;
  }
  async update(id: string, data: Partial<ProntuarioRecordModel>): Promise<ProntuarioRecordModel> {
    const idx = mockProntuarios.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Prontuário não encontrado');
    mockProntuarios[idx] = { ...mockProntuarios[idx], ...data, updatedAt: Date.now(), isSynced: false };
    return mockProntuarios[idx];
  }
  async delete(id: string): Promise<void> {
    mockProntuarios = mockProntuarios.filter((r) => r.id !== id);
  }
}
