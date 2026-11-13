/** Input masks and validators for email, CPF and Brazilian phone numbers (frontend only). */

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Drops whitespace as it is typed; emails never contain spaces. */
export function sanitizeEmail(value: string): string {
  return value.replace(/\s/g, '');
}

const EMAIL_REGEX = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  if (email.length > 254 || email.includes('..')) return false;
  return EMAIL_REGEX.test(email);
}

/** Formats as `000.000.000-00` while typing, keeping at most 11 digits. */
export function maskCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** Checks length and both verification digits; rejects repeated sequences like 111.111.111-11. */
export function isValidCpf(value: string): boolean {
  const d = onlyDigits(value);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

  const checkDigit = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(d[i]) * (length + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return checkDigit(9) === Number(d[9]) && checkDigit(10) === Number(d[10]);
}

/** Formats as `(85) 3333-4444` (landline) or `(85) 99999-9999` (mobile) while typing. */
export function maskPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Valid DDD (11-99, no zero digit) followed by an 8-digit landline or a 9-digit mobile starting with 9. */
export function isValidPhone(value: string): boolean {
  const d = onlyDigits(value);
  if (!/^[1-9][1-9]/.test(d)) return false;
  if (d.length === 11) return d[2] === '9';
  if (d.length === 10) return /[2-5]/.test(d[2]);
  return false;
}
