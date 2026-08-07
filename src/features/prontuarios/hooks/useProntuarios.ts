import { useState, useEffect, useCallback } from 'react';
import { dbRepositories, ProntuarioRecordModel } from '../../../database';

export function useProntuarios() {
  const [records, setRecords] = useState<ProntuarioRecordModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const all = await dbRepositories.prontuarioRepository.getAll();
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        setRecords(all.filter((r) => r.petName.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)));
      } else {
        setRecords(all);
      }
    } catch (error) {
      console.error('Failed to fetch prontuarios:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (data: Omit<ProntuarioRecordModel, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>) => {
    const created = await dbRepositories.prontuarioRepository.create(data);
    await fetchRecords();
    return created;
  };

  return {
    records,
    loading,
    searchQuery,
    setSearchQuery,
    refetch: fetchRecords,
    addRecord,
  };
}
