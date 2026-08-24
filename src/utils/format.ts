export function formatDateBR(timestamp: number | Date | null | undefined): string {
  if (!timestamp) return '--';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleDateString('pt-BR');
}

export function formatAge(birthDate: number | Date | null | undefined): string {
  if (!birthDate) return '--';
  const birth = birthDate instanceof Date ? birthDate : new Date(birthDate);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0) {
    return months <= 1 ? '1 mês' : `${months} meses`;
  }
  return years === 1 ? '1 ano' : `${years} anos`;
}

export function speciesToIcon(especie: string | null | undefined): 'dog' | 'cat' {
  return especie?.toLowerCase().startsWith('fel') ? 'cat' : 'dog';
}
