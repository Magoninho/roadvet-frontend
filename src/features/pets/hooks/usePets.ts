import { useState, useEffect, useCallback } from 'react';
import { dbRepositories, PetModel } from '../../../database';

export function usePets() {
  const [pets, setPets] = useState<PetModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      if (searchQuery.trim()) {
        const results = await dbRepositories.petRepository.searchByName(searchQuery);
        setPets(results);
      } else {
        const all = await dbRepositories.petRepository.getAll();
        setPets(all);
      }
    } catch (error) {
      console.error('Failed to fetch pets:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const addPet = async (data: Omit<PetModel, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>) => {
    const created = await dbRepositories.petRepository.create(data);
    await fetchPets();
    return created;
  };

  return {
    pets,
    loading,
    searchQuery,
    setSearchQuery,
    refetch: fetchPets,
    addPet,
  };
}
