import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { Command, Option } from 'commander';
import { SkillCatalog } from '../../core/skill-catalog.js';
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
  projectRoot,
  wantsAll,
  type TargetOptions,
} from './options.js';
import { printOperation } from './output.js';

interface ManageOptions extends TargetOptions {
  all: boolean;
  yes: boolean;
}

type Operation = 'install' | 'update' | 'remove';

const descriptions: Record<Operation, string> = {
  install: 'Instala uma skill nos hosts selecionados',
  update: 'Atualiza os links das skills instaladas',
  remove: 'Remove uma skill dos hosts selecionados',
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
  catalog: SkillCatalog,
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
  parent
    .command(`${operation} [skill_name]`)
    .description(descriptions[operation])
    .option('--all', 'aplica a operação a todas as skills', false)
    .addOption(
      new Option('--target <host>', 'host de destino')
        .choices(['codex', 'claude', 'all'])
        .default('all'),
    )
    .addOption(
      new Option('--scope <scope>', 'escopo de instalação')
        .choices(['project', 'user'])
        .default('project'),
    )
    .option('--source <directory>', 'diretório do catálogo de skills')
    .option('--project <directory>', 'raiz do projeto', process.cwd())
    .option('--yes', 'não pede confirmação para remove all', false)
    .action(async (skillName: string | undefined, options: ManageOptions) => {
      const all = wantsAll(skillName, options.all);
      if (operation === 'remove' && all && !options.yes) {
        const confirmed = await confirmRemoveAll();
        if (!confirmed) {
          process.stdout.write('Operação cancelada.\n');
          return;
        }
      }

      const catalog = new SkillCatalog(catalogRoot(options));
      const skills = await selectSkills(catalog, skillName, options.all);
      const installer = new SkillInstaller(
        createPathContext(projectRoot(options)),
      );

      for (const skill of skills) {
        const results = await executeOperation(
          operation,
          skill,
          installer,
          options.target,
          options.scope,
        );
        results.forEach(printOperation);
      }
    });
}
