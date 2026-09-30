export const GRID_COLUMNS = 3;

export type GridItem<T> = { id: string; row: T } | { id: string; empty: true };

/**
 * Pads the last row of a multi-column FlatList with empty cells, so its cards keep the same width
 * as the ones above instead of stretching across the leftover space.
 */
export function padGridRows<T extends { id: string }>(rows: T[], columns = GRID_COLUMNS): GridItem<T>[] {
  const data: GridItem<T>[] = rows.map((row) => ({ id: row.id, row }));
  const remainder = data.length % columns;
  if (remainder === 0) return data;

  const emptyItems: GridItem<T>[] = Array.from({ length: columns - remainder }).map(
    (_, index) => ({ id: `empty-${index}`, empty: true })
  );

  return [...data, ...emptyItems];
}
