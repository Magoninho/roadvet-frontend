/**
 * Sort helpers shared by every list screen's "Ordenar" sheet.
 *
 * Sorting happens in JS over the rows the screen already has in memory (after
 * search/filtering), the same place `useSearchFilter` operates. A comparator
 * always compares in ascending order; direction is applied by the factory
 * itself rather than by reversing the sorted array afterwards, so that
 * missing values (no birth date, no city) can be pinned at the end of the
 * list in both directions instead of flipping to the front when descending.
 */

export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  key: string;
  /** Label shown when this option is not the active sort. */
  label: string;
  /** Label shown for the ascending direction once this option is active. */
  ascLabel: string;
  /** Label shown for the descending direction once this option is active. */
  descLabel: string;
  /** Direction applied the first time this option is selected. */
  defaultDirection: SortDirection;
}

export interface SortState {
  key: string;
  direction: SortDirection;
}

export function makeSortState(options: SortOption[]): SortState {
  const [first] = options;
  return { key: first.key, direction: first.defaultDirection };
}

type Comparator<T> = (a: T, b: T) => number;

export function sortByString<T>(getValue: (row: T) => string | null | undefined, direction: SortDirection): Comparator<T> {
  return (a, b) => {
    const valueA = (getValue(a) ?? '').trim();
    const valueB = (getValue(b) ?? '').trim();
    if (!valueA && !valueB) return 0;
    if (!valueA) return 1;
    if (!valueB) return -1;
    const result = valueA.localeCompare(valueB, 'pt-BR', { sensitivity: 'base' });
    return direction === 'asc' ? result : -result;
  };
}

export function sortByNumber<T>(getValue: (row: T) => number | null | undefined, direction: SortDirection): Comparator<T> {
  return (a, b) => {
    const valueA = getValue(a);
    const valueB = getValue(b);
    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;
    const result = valueA - valueB;
    return direction === 'asc' ? result : -result;
  };
}

export function sortByDate<T>(
  getValue: (row: T) => Date | number | null | undefined,
  direction: SortDirection,
): Comparator<T> {
  const toTime = (value: Date | number | null | undefined): number | null => {
    if (value == null) return null;
    return value instanceof Date ? value.getTime() : value;
  };
  return sortByNumber((row) => toTime(getValue(row)), direction);
}

/** Applies `state` using the comparator factory registered under its key; returns `rows` unchanged if the key is unknown. */
export function applySort<T>(rows: T[], state: SortState, comparators: Record<string, Comparator<T>>): T[] {
  const comparator = comparators[state.key];
  if (!comparator) return rows;
  return [...rows].sort(comparator);
}
