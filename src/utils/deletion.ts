import type { DeletionImpact } from '@/database/repositories/cascade';

function removalNotice(count: number, singular: string, plural: string): string {
  return count === 1 ? `1 ${singular} será excluído` : `${count} ${plural} serão excluídos`;
}

/** One line per kind of record a cascading delete also removes, for `ConfirmDialog`'s warnings. */
export function deletionWarnings(impact: DeletionImpact | null, petNames: string[] = []): string[] {
  if (!impact) return [];

  const warnings: string[] = [];
  if (impact.pets > 0) {
    const names = petNames.length > 0 ? `: ${petNames.join(', ')}` : '';
    warnings.push(`${removalNotice(impact.pets, 'pet', 'pets')}${names}.`);
  }
  if (impact.prontuarios > 0) {
    warnings.push(`${removalNotice(impact.prontuarios, 'prontuário', 'prontuários')}.`);
  }
  if (impact.anexos > 0) {
    warnings.push(`${removalNotice(impact.anexos, 'anexo de exame', 'anexos de exames')}.`);
  }
  return warnings;
}
