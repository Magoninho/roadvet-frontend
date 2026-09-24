/**
 * Text search helpers shared by every list screen.
 *
 * Searching happens in JS over the records WatermelonDB already streams to the
 * screen, instead of through `Q.like`. Two reasons:
 *
 * 1. SQLite's `LIKE` is only case-insensitive for ASCII and never
 *    accent-insensitive, so `jose` would not find `José` — unacceptable for
 *    Portuguese names. Here every string is folded to lowercase ASCII first.
 * 2. A useful search crosses tables (a pet by its tutor's name, a prontuário by
 *    its pet's name), which `Q.like` cannot express without fragile nested
 *    `Q.on` clauses, and `Q.unsafeSqlExpr` would break the LokiJS web adapter.
 *
 * The per-record haystack is built once per database emission (see
 * `database/repositories/lists.ts`), not once per keystroke, so typing only
 * costs a substring scan per record.
 */

const ACCENT_FALLBACK: Record<string, string> = {
  á: 'a', à: 'a', ã: 'a', â: 'a', ä: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  í: 'i', ì: 'i', î: 'i', ï: 'i',
  ó: 'o', ò: 'o', õ: 'o', ô: 'o', ö: 'o',
  ú: 'u', ù: 'u', û: 'u', ü: 'u',
  ç: 'c', ñ: 'n',
};

function stripAccents(lowercased: string): string {
  if (typeof lowercased.normalize === 'function') {
    return lowercased.normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  return lowercased.replace(/[áàãâäéèêëíìîïóòõôöúùûüçñ]/g, (char) => ACCENT_FALLBACK[char] ?? char);
}

/** Lowercases, removes accents and collapses whitespace. */
export function normalizeSearchText(value: string | null | undefined): string {
  if (!value) return '';
  return stripAccents(value.toLowerCase()).replace(/\s+/g, ' ').trim();
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Folds every searchable field of a record into a single normalized haystack.
 * Fields that carry digits (CPF, phone, CEP, dates) are also appended stripped
 * of punctuation, so `12345678900` finds a CPF stored as `123.456.789-00`.
 */
export function buildSearchIndex(parts: (string | null | undefined)[]): string {
  const chunks: string[] = [];

  for (const part of parts) {
    const normalized = normalizeSearchText(part);
    if (!normalized) continue;

    chunks.push(normalized);

    const digits = onlyDigits(normalized);
    if (digits.length >= 3 && digits !== normalized) chunks.push(digits);
  }

  return chunks.join(' ');
}

/**
 * Splits the query the user typed into normalized terms. Returns an empty array
 * for a blank query, which callers read as "no filter".
 */
export function toSearchTerms(query: string): string[] {
  const normalized = normalizeSearchText(query);
  return normalized ? normalized.split(' ') : [];
}

/**
 * A record matches when *every* term appears somewhere in its haystack, so
 * `maria rex` narrows to Maria's pet Rex regardless of field or word order.
 */
export function matchesSearchTerms(searchIndex: string, terms: string[]): boolean {
  return terms.every((term) => {
    if (searchIndex.includes(term)) return true;

    // `123.456` typed against a CPF stored with different punctuation.
    const digits = onlyDigits(term);
    return digits.length >= 3 && searchIndex.includes(digits);
  });
}
