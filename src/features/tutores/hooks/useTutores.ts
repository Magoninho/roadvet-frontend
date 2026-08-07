import { useState, useEffect, useCallback } from 'react';
import { dbRepositories, TutorModel } from '../../../database';

export function useTutores() {
  const [tutores, setTutores] = useState<TutorModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTutores = useCallback(async () => {
    try {
      setLoading(true);
      if (searchQuery.trim()) {
        const results = await dbRepositories.tutorRepository.searchByName(searchQuery);
        setTutores(results);
      } else {
        const all = await dbRepositories.tutorRepository.getAll();
        setTutores(all);
      }
    } catch (error) {
      console.error('Failed to fetch tutores:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchTutores();
  }, [fetchTutores]);

  const addTutor = async (data: { name: string; phone: string }) => {
    const created = await dbRepositories.tutorRepository.create(data);
    await fetchTutores();
    return created;
  };

  return {
    tutores,
    loading,
    searchQuery,
    setSearchQuery,
    refetch: fetchTutores,
    addTutor,
  };
}
