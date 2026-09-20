import { lstat, mkdir, readlink, symlink, unlink } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { DevskillError } from '../errors/devskill-error.js';
import type {
  InstallScope,
  Skill,
  SkillOperationResult,
} from '../models/skill.js';
import type { HostAdapter } from '../hosts/host-adapter.js';
import type { PathContext } from '../utils/paths.js';

type LinkState = 'missing' | 'managed' | 'conflict';

async function linkState(source: string, destination: string): Promise<LinkState> {
  try {
    const stats = await lstat(destination);
    if (!stats.isSymbolicLink()) {
      return 'conflict';
    }

    const target = await readlink(destination);
    const resolvedTarget = resolve(dirname(destination), target);
    return resolvedTarget === resolve(source) ? 'managed' : 'conflict';
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return 'missing';
    }
    throw error;
  }
}

function conflictError(destination: string): DevskillError {
  return new DevskillError(
    `O destino já existe e não é gerenciado pelo devskill: ${destination}`,
    'INSTALL_CONFLICT',
  );
}

async function createSkillLink(source: string, destination: string): Promise<void> {
  await mkdir(dirname(destination), { recursive: true });
  const type = process.platform === 'win32' ? 'junction' : 'dir';
  await symlink(resolve(source), destination, type);
}

export class SkillInstaller {
  constructor(private readonly context: PathContext) {}

  destination(
    skill: Skill,
    host: HostAdapter,
    scope: InstallScope,
  ): string {
    return join(host.installationDirectory(scope, this.context), skill.name);
  }

  async isInstalled(
    skill: Skill,
    host: HostAdapter,
    scope: InstallScope,
  ): Promise<boolean> {
    return (
      (await linkState(skill.directory, this.destination(skill, host, scope))) ===
      'managed'
    );
  }

  async install(
    skill: Skill,
    host: HostAdapter,
    scope: InstallScope,
  ): Promise<SkillOperationResult> {
    const destination = this.destination(skill, host, scope);
    const state = await linkState(skill.directory, destination);

    if (state === 'conflict') {
      throw conflictError(destination);
    }
    if (state === 'managed') {
      return {
        skill: skill.name,
        host: host.name,
        destination,
        status: 'already-installed',
      };
    }

    await createSkillLink(skill.directory, destination);
    return {
      skill: skill.name,
      host: host.name,
      destination,
      status: 'installed',
    };
  }

  async update(
    skill: Skill,
    host: HostAdapter,
    scope: InstallScope,
  ): Promise<SkillOperationResult> {
    const destination = this.destination(skill, host, scope);
    const state = await linkState(skill.directory, destination);

    if (state === 'conflict') {
      throw conflictError(destination);
    }
    if (state === 'missing') {
      return {
        skill: skill.name,
        host: host.name,
        destination,
        status: 'not-installed',
      };
    }

    await unlink(destination);
    await createSkillLink(skill.directory, destination);
    return {
      skill: skill.name,
      host: host.name,
      destination,
      status: 'updated',
    };
  }

  async remove(
    skill: Skill,
    host: HostAdapter,
    scope: InstallScope,
  ): Promise<SkillOperationResult> {
    const destination = this.destination(skill, host, scope);
    const state = await linkState(skill.directory, destination);

    if (state === 'conflict') {
      throw conflictError(destination);
    }
    if (state === 'missing') {
      return {
        skill: skill.name,
        host: host.name,
        destination,
        status: 'not-installed',
      };
    }

    await unlink(destination);
    return {
      skill: skill.name,
      host: host.name,
      destination,
      status: 'removed',
    };
  }
}
