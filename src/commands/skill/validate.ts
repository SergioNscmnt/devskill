import { Command } from 'commander';
import { SkillCatalog } from '../../core/skill-catalog.js';
import { catalogRoot, type CatalogOptions } from './options.js';

export function registerValidateCommand(parent: Command): void {
  parent
    .command('validate [skill_name]')
    .description('Valida uma skill ou todo o catálogo')
    .option('--source <directory>', 'diretório do catálogo de skills')
    .action(async (skillName: string | undefined, options: CatalogOptions) => {
      const catalog = new SkillCatalog(await catalogRoot(options));
      const skills = skillName ? [await catalog.get(skillName)] : await catalog.list();
      for (const skill of skills) {
        process.stdout.write(`${skill.name}: válida\n`);
      }
    });
}
