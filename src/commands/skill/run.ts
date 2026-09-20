import { resolve } from 'node:path';
import { Command, Option } from 'commander';
import { SkillCatalog } from '../../core/skill-catalog.js';
import { SkillInstaller } from '../../core/skill-installer.js';
import { SkillRunner } from '../../core/skill-runner.js';
import { DevskillError } from '../../errors/devskill-error.js';
import { getHostAdapter } from '../../hosts/index.js';
import type { HostName } from '../../models/skill.js';
import { createPathContext } from '../../utils/paths.js';
import { catalogRoot, type CatalogOptions } from './options.js';

interface RunOptions extends CatalogOptions {
  agent: HostName;
  cwd: string;
  dryRun: boolean;
}

export function registerRunCommand(parent: Command): void {
  parent
    .command('run <skill_name> [args...]')
    .description('Executa uma skill através do Codex ou Claude Code')
    .addOption(
      new Option('--agent <agent>', 'agente que executará a skill')
        .choices(['codex', 'claude'])
        .default('codex'),
    )
    .option('--source <directory>', 'diretório do catálogo de skills')
    .option('--cwd <directory>', 'diretório de trabalho do agente', process.cwd())
    .option('--dry-run', 'mostra o comando sem executá-lo', false)
    .action(
      async (skillName: string, args: string[], options: RunOptions) => {
        const skill = await new SkillCatalog(catalogRoot(options)).get(skillName);
        const cwd = resolve(options.cwd);
        const host = getHostAdapter(options.agent);
        const installer = new SkillInstaller(createPathContext(cwd));
        const installedInProject = await installer.isInstalled(
          skill,
          host,
          'project',
        );
        const installedForUser = await installer.isInstalled(skill, host, 'user');

        if (!installedInProject && !installedForUser) {
          throw new DevskillError(
            `A skill ${skill.name} não está instalada para ${host.name}. Execute devskill skill install ${skill.name} --target ${host.name}`,
            'SKILL_NOT_INSTALLED',
          );
        }

        await new SkillRunner().run(skill, host, {
          args,
          cwd,
          dryRun: options.dryRun,
        });
      },
    );
}
