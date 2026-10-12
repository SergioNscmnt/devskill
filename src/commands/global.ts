import { Command, Option } from 'commander';
import { execa } from 'execa';
import { readFile } from 'node:fs/promises';
import { SkillCatalog } from '../core/skill-catalog.js';
import { GlobalSkillManager } from '../core/global-skills.js';
import { createPathContext } from '../utils/paths.js';
import { catalogRoot, type CatalogOptions } from './skill/options.js';
import type { HostName } from '../models/skill.js';

interface GlobalOptions extends CatalogOptions { host: 'all' | HostName; sync?: boolean; }
const hosts = ['codex', 'claude'] as const;

export async function updatePackage(
  current: string,
  fetchLatest: () => Promise<string>,
  install: (version: string) => Promise<void>,
): Promise<{ latest: string; updated: boolean }> {
  const latest = await fetchLatest();
  if (compareVersions(latest, current) <= 0) return { latest, updated: false };
  await install(latest);
  return { latest, updated: true };
}

function manager(): GlobalSkillManager { return new GlobalSkillManager(createPathContext()); }

async function selectedHosts(value: GlobalOptions['host']): Promise<readonly HostName[]> {
  return value === 'all' ? hosts : [value];
}

export function registerGlobalCommands(program: Command): void {
  program.command('init')
    .description('Inicializa os diretórios globais do Codex e Claude Code')
    .action(async () => {
      const dirs = await manager().init();
      process.stdout.write(`Diretórios globais preparados:\n${dirs.map((path) => `  ${path}`).join('\n')}\n`);
      const executables = await Promise.all(['codex', 'claude'].map(async (name) => {
        try { await execa(name, ['--version']); return `${name}: disponível`; }
        catch { return `${name}: não encontrado no PATH`; }
      }));
      process.stdout.write(`${executables.join('\n')}\n`);
      process.stdout.write('Nenhuma skill foi instalada.\n');
    });

  program.command('list')
    .description('Lista o catálogo e o estado real de instalação global')
    .option('--source <directory>', 'diretório do catálogo')
    .action(async (options: CatalogOptions) => {
      const skills = await new SkillCatalog(await catalogRoot(options)).list();
      const skillManager = manager();
      process.stdout.write('Available SKILLs:\n\n');
      for (const skill of skills) {
        const [codex, claude] = await Promise.all(hosts.map((host) => skillManager.installed(skill, host)));
        const status = codex && claude ? 'installed' : !codex && !claude ? 'install' : `codex:${codex ? 'installed' : 'install'} claude:${claude ? 'installed' : 'install'}`;
        process.stdout.write(`${skill.name.padEnd(15)} (${status})\n`);
      }
    });

  for (const operation of ['install', 'remove'] as const) {
    program.command(`${operation} <skill_name>`)
      .description(operation === 'install' ? 'Instala uma skill globalmente para os agentes' : 'Remove skills DevSkill dos diretórios globais')
      .option('--source <directory>', 'diretório do catálogo')
      .addOption(new Option('--host <host>', 'agente de destino').choices(['all', 'codex', 'claude']).default('all'))
      .option('--sync', 'sincroniza explicitamente instalações gerenciadas', false)
      .action(async (name: string, options: GlobalOptions) => {
        const catalog = new SkillCatalog(await catalogRoot(options));
        const skills = name === 'all' ? await catalog.list() : [await catalog.get(name)];
        const skillManager = manager();
        const targetHosts = await selectedHosts(options.host);
        if (operation === 'install') {
          for (const skill of skills) for (const host of targetHosts) await skillManager.assertCanInstall(skill, host, options.sync);
        }
        for (const skill of skills) {
          for (const host of targetHosts) {
            if (operation === 'install') {
              const status = await skillManager.install(skill, host, options.sync);
              process.stdout.write(`${skill.name} → ${host}: ${status}\n`);
              process.stdout.write(`  Use ${host === 'codex' ? `$devskill-${skill.name}` : `/devskill_${skill.name}`} no chat do agente.\n`);
            } else {
              const removed = await skillManager.removeManaged(skill, host);
              process.stdout.write(`${skill.name} → ${host}: ${removed ? 'removed' : 'not-installed'}\n`);
            }
          }
        }
      });
  }

  program.command('update')
    .description('Verifica e atualiza o pacote npm DevSkill')
    .action(async () => {
      const current = await installedPackageVersion();
      let result: { latest: string; updated: boolean };
      try {
        result = await updatePackage(current, async () => {
          const response = await fetch('https://registry.npmjs.org/@jsndev%2fdevskill/latest', { signal: AbortSignal.timeout(10000) });
          if (!response.ok) throw new Error(`npm registry respondeu HTTP ${response.status}`);
          const metadata = await response.json() as { version?: unknown };
          if (typeof metadata.version !== 'string') throw new Error('Resposta do registry sem versão válida');
          return metadata.version;
        }, async (version) => {
          await execa('npm', ['install', '--global', `@jsndev/devskill@${version}`], { stdio: 'inherit' });
        });
      } catch (error) {
        throw new Error(`Falha ao verificar/atualizar pelo npm: ${error instanceof Error ? error.message : String(error)}. Confira rede e permissões do npm; o CLI não usa sudo.`);
      }
      process.stdout.write(`Versão instalada: ${current}\nVersão publicada: ${result.latest}\n`);
      if (!result.updated) {
        process.stdout.write('O pacote já está atualizado.\n');
        return;
      }
      process.stdout.write('Pacote atualizado. As skills globais não foram alteradas.\n');
      process.stdout.write('Para sincronizar skills explicitamente, execute: devskill-cli install all --sync\n');
    });
}

async function installedPackageVersion(): Promise<string> {
  const paths = [new URL('../../package.json', import.meta.url), new URL('../../../package.json', import.meta.url)];
  for (const path of paths) {
    try {
      const data = JSON.parse(await readFile(path, 'utf8')) as { version?: string };
      if (data.version) return data.version;
    } catch { /* Try the other package layout. */ }
  }
  throw new Error('Não foi possível localizar a versão instalada do pacote');
}

export function compareVersions(left: string, right: string): number {
  const parse = (version: string) => version.replace(/^v/, '').split('.').slice(0, 3).map((part) => Number(part.split('-')[0]));
  const a = parse(left); const b = parse(right);
  if (a.length !== 3 || b.length !== 3 || [...a, ...b].some((n) => !Number.isInteger(n))) throw new Error('Versão SemVer inválida recebida do npm');
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i]! > b[i]! ? 1 : -1;
  return 0;
}
