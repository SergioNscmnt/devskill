import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { Command, Option } from 'commander';
import { LocalSkillCatalog } from '../../core/local-skill-catalog.js';
import { SkillInstaller } from '../../core/skill-installer.js';
import { DevskillError } from '../../errors/devskill-error.js';
import { resolveHostAdapters } from '../../hosts/index.js';
import type {
  HostTarget,
  InstallScope,
  Skill,
  SkillOperationResult,
} from '../../models/skill.js';
import { createPathContext } from '../../utils/paths.js';
import {
  catalogRoot,
  wantsAll,
  type CatalogOptions,
} from './options.js';
import { printOperation } from './output.js';

interface ManageOptions extends CatalogOptions {
  target?: HostTarget;
  all: boolean;
  yes: boolean;
  scope: InstallScope;
}

type Operation = 'install' | 'update' | 'remove';

const descriptions: Record<Operation, string> = {
  install: 'Disponibiliza uma skill no projeto para Codex e Claude Code',
  update: 'Atualiza os links da skill no projeto',
  remove: 'Remove uma skill do projeto',
};

async function confirmRemoveAll(): Promise<boolean> {
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new DevskillError(
      'Use --yes para confirmar remove all em modo não interativo',
      'CONFIRMATION_REQUIRED',
    );
  }

  const prompt = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await prompt.question(
      'Remover todas as skills gerenciadas dos hosts selecionados? [y/N] ',
    );
    return /^(y|yes|s|sim)$/i.test(answer.trim());
  } finally {
    prompt.close();
  }
}

async function selectSkills(
  catalog: LocalSkillCatalog,
  skillName: string | undefined,
  all: boolean,
): Promise<Skill[]> {
  if (wantsAll(skillName, all)) {
    return catalog.list();
  }
  if (!skillName) {
    throw new DevskillError(
      'Informe <skill_name>, use o argumento all ou passe --all',
      'SKILL_NAME_REQUIRED',
    );
  }
  return [await catalog.get(skillName)];
}

async function executeOperation(
  operation: Operation,
  skill: Skill,
  installer: SkillInstaller,
  target: HostTarget,
  scope: InstallScope,
): Promise<SkillOperationResult[]> {
  return Promise.all(
    resolveHostAdapters(target).map((host) =>
      installer[operation](skill, host, scope),
    ),
  );
}

export function registerManageCommand(parent: Command, operation: Operation): void {
  const command = parent
    .command(`${operation} [skill_name]`)
    .description(descriptions[operation])
    .option('--all', 'aplica a operação a todas as skills', false)
    .addOption(
      new Option('--target <host>', 'agentes de destino')
        .choices(['codex', 'claude', 'all']),
    )
    .option('--source <directory>', 'diretório do catálogo de skills')
    .addOption(
      new Option('--scope <scope>', 'local de instalação das skills')
        .choices(['project', 'user'])
        .default('project'),
    )
    .option('--yes', 'não pede confirmação para delete all', false);

  if (operation === 'remove') {
    command.alias('delete');
  }

  command.action(async (skillName: string | undefined, options: ManageOptions) => {
    const all = wantsAll(skillName, options.all);
    if (operation === 'remove' && all && !options.yes) {
      const confirmed = await confirmRemoveAll();
      if (!confirmed) {
        process.stdout.write('Operação cancelada.\n');
        return;
      }
    }

    const catalog = new LocalSkillCatalog(await catalogRoot(options));
    const skills = await selectSkills(catalog, skillName, options.all);
    const installer = new SkillInstaller(createPathContext());
    const target = options.target ?? 'all';

    for (const skill of skills) {
      const results = await executeOperation(
        operation,
        skill,
        installer,
        target,
        options.scope,
      );
      results.forEach(printOperation);
    }
  });
}
