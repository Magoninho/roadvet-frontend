import { useState } from 'react';
import type { DeletionImpact } from '@/database/repositories/cascade';

interface UseDeleteConfirmationOptions {
  /** Counts what the deletion takes with it, so the dialog can spell it out before the user confirms. */
  measure: () => Promise<DeletionImpact>;
  remove: () => Promise<void>;
  onDeleted: () => void;
}

/** State behind a `ConfirmDialog` guarding a cascading delete. */
export function useDeleteConfirmation({ measure, remove, onDeleted }: UseDeleteConfirmationOptions) {
  const [visible, setVisible] = useState(false);
  const [impact, setImpact] = useState<DeletionImpact | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = async () => {
    setError(null);
    try {
      setImpact(await measure());
    } catch {
      // The dialog still states the cascade in general terms, just without the counts.
      setImpact(null);
    }
    setVisible(true);
  };

  const cancel = () => setVisible(false);

  const confirm = async () => {
    if (deleting) return;
    setDeleting(true);
    setError(null);
    try {
      await remove();
      setVisible(false);
      onDeleted();
    } catch {
      setError('Não foi possível excluir. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  return { visible, impact, deleting, error, open, cancel, confirm };
}
