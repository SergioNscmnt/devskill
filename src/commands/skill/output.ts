import type { SkillOperationResult } from '../../models/skill.js';

const statusLabels: Record<SkillOperationResult['status'], string> = {
  installed: 'instalada',
  'already-installed': 'já instalada',
  updated: 'atualizada',
  removed: 'removida',
  'not-installed': 'não instalada',
};

export function printOperation(result: SkillOperationResult): void {
  process.stdout.write(
    `${result.skill} [${result.host}]: ${statusLabels[result.status]} (${result.destination})\n`,
  );
}
