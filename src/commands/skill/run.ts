import { resolve } from 'node:path';
import { Command, Option } from 'commander';
import { loadConfig } from '../../core/config-loader.js';
import { detectHostForSkill } from '../../core/host-detector.js';
import { SkillCatalog } from '../../core/skill-catalog.js';
import { SkillInstaller } from '../../core/skill-installer.js';
import { SkillRunner } from '../../core/skill-runner.js';
import { DevskillError } from '../../errors/devskill-error.js';
import { getHostAdapter } from '../../hosts/index.js';
import type { HostName, InstallScope } from '../../models/skill.js';
import { createPathContext } from '../../utils/paths.js';
import { catalogRoot, type CatalogOptions } from './options.js';

interface RunOptions extends CatalogOptions {
  agent?: HostName;
  cwd: string;
  dryRun: boolean;
  scope: InstallScope;
}

export function registerRunCommand(parent: Command): void {
  parent
    .command('run <skill_name> [args...]')
    .description('Executa uma skill no agente em que ela está instalada')
    .addOption(
      new Option('--agent <agent>', 'substitui a detecção automática do agente')
        .choices(['codex', 'claude']),
    )
    .option('--source <directory>', 'diretório do catálogo de skills')
    .option('--cwd <directory>', 'diretório de trabalho do agente', process.cwd())
    .addOption(
      new Option('--scope <scope>', 'escopo em que a skill está instalada')
        .choices(['project', 'user'])
        .default('project'),
    )
    .option('--dry-run', 'mostra o comando sem executá-lo', false)
    .action(
      async (skillName: string, args: string[], options: RunOptions) => {
        const skill = await new SkillCatalog(await catalogRoot(options)).get(skillName);
        const cwd = resolve(options.cwd);
        const installer = new SkillInstaller(createPathContext(cwd));
        const host = options.agent
          ? getHostAdapter(options.agent)
          : await detectHostForSkill(skill, installer, await loadConfig(), options.scope);
        const installed = await installer.isInstalled(skill, host, options.scope);

        if (!installed) {
          throw new DevskillError(
            `A skill ${skill.name} não está instalada no escopo ${options.scope} para ${host.name}. Execute skill install ${skill.name}`,
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
