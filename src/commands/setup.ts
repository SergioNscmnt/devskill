import { Command, Option } from 'commander';
import { loadBundledDevskill } from '../core/bundled-skill.js';
import { SkillCatalog } from '../core/skill-catalog.js';
import { SkillInstaller } from '../core/skill-installer.js';
import { resolveHostAdapters } from '../hosts/index.js';
import type { HostTarget } from '../models/skill.js';
import { createPathContext } from '../utils/paths.js';
import { catalogRoot, type CatalogOptions } from './skill/options.js';
import { printOperation } from './skill/output.js';

interface SetupOptions extends CatalogOptions {
  target?: HostTarget;
}

export function registerSetupCommand(program: Command): void {
  program
    .command('init')
    .alias('setup')
    .description('Configura a integração devskill no projeto para Codex e Claude Code')
    .addOption(
      new Option('--target <host>', 'agentes configurados no projeto')
        .choices(['codex', 'claude', 'all'])
        .default('all'),
    )
    .action(async (options: SetupOptions) => {
      const configuredCatalog = new SkillCatalog(await catalogRoot(options));
      await configuredCatalog.list();

      const skill = await loadBundledDevskill();
      const installer = new SkillInstaller(createPathContext());
      const target = options.target ?? 'all';

      for (const host of resolveHostAdapters(target)) {
        printOperation(
          await installer.install(skill, host, 'project'),
        );
      }
    });
}
