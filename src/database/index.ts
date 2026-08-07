import { MockTutorRepository, MockPetRepository, MockProntuarioRepository } from './repositories/MockRepositories';
import { ITutorRepository } from './repositories/ITutorRepository';
import { IPetRepository } from './repositories/IPetRepository';
import { IProntuarioRepository } from './repositories/IProntuarioRepository';

export * from './repositories/types';
export * from './repositories/ITutorRepository';
export * from './repositories/IPetRepository';
export * from './repositories/IProntuarioRepository';

/**
 * Database Repository Container.
 * When WatermelonDB is connected, swap Mock instances for WatermelonDB Repository instances here.
 */
class RepositoryContainer {
  tutorRepository: ITutorRepository = new MockTutorRepository();
  petRepository: IPetRepository = new MockPetRepository();
  prontuarioRepository: IProntuarioRepository = new MockProntuarioRepository();

  setTutorRepository(repo: ITutorRepository) {
    this.tutorRepository = repo;
  }
  setPetRepository(repo: IPetRepository) {
    this.petRepository = repo;
  }
  setProntuarioRepository(repo: IProntuarioRepository) {
    this.prontuarioRepository = repo;
  }
}

export const dbRepositories = new RepositoryContainer();
