import { useMemo } from 'react';
import { matchesSearchTerms, toSearchTerms } from '@/utils/search';
import { useDebouncedValue } from './useDebouncedValue';

/**
 * Filters rows carrying a precomputed `searchIndex` (see
 * `database/repositories/lists.ts`) against what the user typed. A blank query
 * returns the original array reference, so an idle search box costs nothing.
 */
export function useSearchFilter<T extends { searchIndex: string }>(rows: T[], query: string): T[] {
  const debouncedQuery = useDebouncedValue(query);
  const terms = useMemo(() => toSearchTerms(debouncedQuery), [debouncedQuery]);

  return useMemo(
    () => (terms.length === 0 ? rows : rows.filter((row) => matchesSearchTerms(row.searchIndex, terms))),
    [rows, terms],
  );
}
