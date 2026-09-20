import { Command } from 'commander';
import { SkillCatalog } from '../../core/skill-catalog.js';
import { renderMarkdownForTerminal } from '../../utils/markdown-terminal.js';
import { catalogRoot, type CatalogOptions } from './options.js';

interface ShowOptions extends CatalogOptions {
  raw: boolean;
}

export function registerShowCommand(parent: Command): void {
  parent
    .command('show <skill_name>')
    .description('Exibe os metadados e as instruções de uma skill')
    .option('--source <directory>', 'diretório do catálogo de skills')
    .option('--raw', 'exibe o Markdown original, sem formatação de terminal', false)
    .action(async (skillName: string, options: ShowOptions) => {
      const skill = await new SkillCatalog(catalogRoot(options)).get(skillName);
      const content = options.raw
        ? skill.content
        : renderMarkdownForTerminal(skill.content);
      process.stdout.write(
        `${skill.name}\n${skill.description}\n${skill.skillFile}\n\n${content}\n`,
      );
    });
}
