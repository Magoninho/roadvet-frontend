/**
 * Filter helpers shared by every list screen's "Filtrar" sheet.
 *
 * A filter set is made of independent "chip groups" (multi-select over a
 * dynamic list of values found in the current data, e.g. species or city)
 * and independent boolean "toggles" (e.g. "only tutors with pets"). All
 * groups and toggles are ANDed together; within one chip group, values are
 * ORed (selecting "Cão" and "Gato" keeps both).
 */

import type { BadgeType } from '@/app/components/StatusBadge';

export interface FilterChipOption {
  value: string;
  label: string;
}

export interface FilterChipGroupConfig {
  key: string;
  title: string;
  options: FilterChipOption[];
}

export interface FilterToggleConfig {
  key: string;
  label: string;
  /** Shows the same badge icon used on the list cards next to the label, so the user learns what it means. */
  badge?: BadgeType;
}

export interface FilterConfig {
  chipGroups: FilterChipGroupConfig[];
  toggles: FilterToggleConfig[];
}

export interface FilterState {
  chips: Record<string, string[]>;
  toggles: Record<string, boolean>;
}

export function makeEmptyFilterState(): FilterState {
  return { chips: {}, toggles: {} };
}

export function isFilterActive(state: FilterState): boolean {
  return Object.values(state.chips).some((values) => values.length > 0) || Object.values(state.toggles).some(Boolean);
}

export function countActiveFilters(state: FilterState): number {
  const chipCount = Object.values(state.chips).reduce((sum, values) => sum + values.length, 0);
  const toggleCount = Object.values(state.toggles).filter(Boolean).length;
  return chipCount + toggleCount;
}

export function toggleChip(state: FilterState, groupKey: string, value: string): FilterState {
  const current = state.chips[groupKey] ?? [];
  const next = current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value];
  return { ...state, chips: { ...state.chips, [groupKey]: next } };
}

export function setToggle(state: FilterState, toggleKey: string, active: boolean): FilterState {
  return { ...state, toggles: { ...state.toggles, [toggleKey]: active } };
}

/** Builds one chip option per distinct, non-empty value returned by `getValue`, sorted and de-duplicated case/accent-insensitively. */
export function distinctChipOptions<T>(rows: T[], getValue: (row: T) => string | null | undefined): FilterChipOption[] {
  const byNormalized = new Map<string, string>();

  for (const row of rows) {
    const raw = getValue(row)?.trim();
    if (!raw) continue;
    const normalized = raw.toLocaleLowerCase('pt-BR');
    if (!byNormalized.has(normalized)) byNormalized.set(normalized, raw);
  }

  return Array.from(byNormalized.values())
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }))
    .map((value) => ({ value: value.toLocaleLowerCase('pt-BR'), label: value }));
}

/**
 * Keeps rows matching every active chip group (OR within a group) and every
 * active toggle's predicate. A row is checked against a chip group via
 * `getGroupValue`, normalized the same way `distinctChipOptions` built the
 * option list, so selecting "Cão" matches a pet stored as "cão", "Cão" or "CÃO".
 */
export function applyFilters<T>(
  rows: T[],
  state: FilterState,
  chipValueGetters: Record<string, (row: T) => string | null | undefined>,
  togglePredicates: Record<string, (row: T) => boolean>,
): T[] {
  const activeChipGroups = Object.entries(state.chips).filter(([, values]) => values.length > 0);
  const activeToggles = Object.entries(state.toggles).filter(([, active]) => active);

  if (activeChipGroups.length === 0 && activeToggles.length === 0) return rows;

  return rows.filter((row) => {
    for (const [groupKey, selected] of activeChipGroups) {
      const getValue = chipValueGetters[groupKey];
      if (!getValue) continue;
      const normalized = getValue(row)?.trim().toLocaleLowerCase('pt-BR') ?? '';
      if (!selected.includes(normalized)) return false;
    }

    for (const [toggleKey, active] of activeToggles) {
      if (!active) continue;
      const predicate = togglePredicates[toggleKey];
      if (predicate && !predicate(row)) return false;
    }

    return true;
  });
}
