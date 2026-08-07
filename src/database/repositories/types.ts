export type SyncStatusType = 'synced' | 'pending' | 'offline';

export interface TutorModel {
  id: string;
  name: string;
  phone: string;
  cpf?: string;
  address?: string;
  createdAt: number;
  updatedAt: number;
  isSynced: boolean;
}

export interface PetModel {
  id: string;
  tutorId: string;
  tutorName: string;
  name: string;
  species: string;
  breed: string;
  birthDate?: string;
  weight?: string;
  avatarUrl?: string;
  createdAt: number;
  updatedAt: number;
  isSynced: boolean;
}

export interface ProntuarioRecordModel {
  id: string;
  petId: string;
  petName: string;
  tutorName: string;
  date: string;
  type: 'medication' | 'vaccine' | 'exam';
  title: string;
  notes?: string;
  vitalSigns?: {
    temperature?: string;
    heartRate?: string;
    respiratoryRate?: string;
  };
  createdAt: number;
  updatedAt: number;
  isSynced: boolean;
}
