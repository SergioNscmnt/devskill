import { Command, Option } from 'commander';
import { LocalSkillCatalog } from '../../core/local-skill-catalog.js';
import { SkillInstaller } from '../../core/skill-installer.js';
import { resolveHostAdapters } from '../../hosts/index.js';
import type { HostTarget, InstallScope } from '../../models/skill.js';
import { renderMarkdownForTerminal } from '../../utils/markdown-terminal.js';
import { createPathContext } from '../../utils/paths.js';
import { catalogRoot, type CatalogOptions } from './options.js';

interface ListOptions extends CatalogOptions {
  target: HostTarget;
  json: boolean;
  status: boolean;
  scope: InstallScope;
}

const maxListDescriptionLength = 140;

function compactDescription(description: string): string {
  if (description.length <= maxListDescriptionLength) {
    return description;
  }

  const excerpt = description.slice(0, maxListDescriptionLength - 1);
  const lastWordBoundary = excerpt.lastIndexOf(' ');
  return `${excerpt.slice(0, lastWordBoundary > 0 ? lastWordBoundary : excerpt.length)}…`;
}

export function registerListCommand(parent: Command): void {
  parent
    .command('list')
    .description('Lista as skills disponíveis no catálogo local')
    .option('--source <directory>', 'diretório do catálogo de skills')
    .addOption(
      new Option('--target <host>', 'host consultado')
        .choices(['codex', 'claude', 'all'])
        .default('all'),
    )
    .option('--status', 'inclui a disponibilidade no escopo escolhido por host', false)
    .addOption(
      new Option('--scope <scope>', 'escopo consultado')
        .choices(['project', 'user'])
        .default('project'),
    )
    .option('--json', 'emite JSON', false)
    .action(async (options: ListOptions) => {
      const catalog = new LocalSkillCatalog(await catalogRoot(options));
      const skills = await catalog.list();
      const rows = await Promise.all(
        skills.map(async (skill) => {
          const row = {
            name: skill.name,
            title: skill.title,
            description: skill.description,
          };

          if (!options.status && !options.json) {
            return row;
          }

          const context = createPathContext();
          const installer = new SkillInstaller(context);
          const hosts = resolveHostAdapters(options.target as HostTarget);
          return {
            ...row,
            installed: Object.fromEntries(
              await Promise.all(
                hosts.map(async (host) => [
                  host.name,
                  await installer.isInstalled(skill, host, options.scope),
                ]),
              ),
            ),
          };
        }),
      );

      if (options.json) {
        process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
        return;
      }

      if (rows.length === 0) {
        process.stdout.write('Nenhuma skill encontrada.\n');
        return;
      }

      for (const row of rows) {
        const status =
          'installed' in row
            ? ` [${Object.entries(row.installed)
                .map(([host, installed]) => `${host}:${installed ? 'sim' : 'não'}`)
                .join(' ')}]`
            : '';
        const item = renderMarkdownForTerminal(
          `# ${row.title}\n\n${compactDescription(row.description)}${status}`,
        );
        process.stdout.write(`${item}\n\n`);
      }
    });
}
