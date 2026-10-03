import { execa } from 'execa';
import { DevskillError } from '../errors/devskill-error.js';
import { getHostAdapter, resolveHostAdapters } from '../hosts/index.js';
import type { HostAdapter } from '../hosts/host-adapter.js';
import type { HostName, HostTarget, Skill } from '../models/skill.js';
import type { DevskillConfig } from './config-loader.js';
import { SkillInstaller } from './skill-installer.js';

type ExecutableDetector = (host: HostAdapter) => Promise<boolean>;

const environmentMarkers: Record<HostName, readonly string[]> = {
  codex: ['CODEX_THREAD_ID', 'CODEX_SESSION_ID'],
  claude: ['CLAUDECODE', 'CLAUDE_CODE_ENTRYPOINT'],
};

function hasEnvironmentMarker(
  host: HostName,
  environment: NodeJS.ProcessEnv,
): boolean {
  return environmentMarkers[host].some((key) => Boolean(environment[key]));
}

async function isExecutableAvailable(host: HostAdapter): Promise<boolean> {
  try {
    const result = await execa(host.executable, ['--version'], {
      reject: false,
      stdio: 'ignore',
    });
    return result.exitCode === 0;
  } catch {
    return false;
  }
}

export async function resolveHostTarget(
  explicitTarget: HostTarget | undefined,
  config: DevskillConfig,
  environment: NodeJS.ProcessEnv = process.env,
  executableDetector: ExecutableDetector = isExecutableAvailable,
): Promise<HostTarget> {
  if (explicitTarget) {
    return explicitTarget;
  }

  const environmentHosts = resolveHostAdapters('all').filter((host) =>
    hasEnvironmentMarker(host.name, environment),
  );
  if (environmentHosts.length === 1) {
    return environmentHosts[0]!.name;
  }

  if (config.defaultAgent) {
    return config.defaultAgent;
  }

  if (environmentHosts.length > 1) {
    throw new DevskillError(
      'Não foi possível identificar o agente porque o ambiente contém sinais do Codex e do Claude Code. Configure: devskill config set default-agent codex',
      'AMBIGUOUS_HOST',
    );
  }

  const availableHosts = (
    await Promise.all(
      resolveHostAdapters('all').map(async (host) => ({
        host,
        available: await executableDetector(host),
      })),
    )
  )
    .filter((candidate) => candidate.available)
    .map((candidate) => candidate.host);

  if (availableHosts.length === 1) {
    return availableHosts[0]!.name;
  }

  throw new DevskillError(
    'Não foi possível identificar o agente atual. Execute o comando dentro do Codex ou Claude Code, ou configure uma vez: devskill config set default-agent codex',
    'HOST_NOT_DETECTED',
  );
}

export async function detectHostForSkill(
  skill: Skill,
  installer: SkillInstaller,
  config: DevskillConfig,
  scope: 'project' | 'user' = 'project',
): Promise<HostAdapter> {
  const installedHosts = (
    await Promise.all(
      resolveHostAdapters('all').map(async (host) => ({
        host,
        installed: await installer.isInstalled(skill, host, scope),
      })),
    )
  )
    .filter((candidate) => candidate.installed)
    .map((candidate) => candidate.host);

  if (installedHosts.length === 1) {
    return installedHosts[0]!;
  }

  if (config.defaultAgent) {
    const preferredHost = getHostAdapter(config.defaultAgent);
    if (installedHosts.some((host) => host.name === preferredHost.name)) {
      return preferredHost;
    }

    throw new DevskillError(
      `A skill ${skill.name} não está instalada para o agente padrão ${preferredHost.name}. Execute devskill install ${skill.name}`,
      'SKILL_NOT_INSTALLED',
    );
  }

  if (installedHosts.length === 0) {
    throw new DevskillError(
      `A skill ${skill.name} não está instalada. Execute devskill install ${skill.name}`,
      'SKILL_NOT_INSTALLED',
    );
  }

  throw new DevskillError(
    `A skill ${skill.name} está instalada no Codex e no Claude Code. Defina uma preferência: devskill config set default-agent codex`,
    'AMBIGUOUS_HOST',
  );
}
