import { execa } from 'execa';
import { DevskillError } from '../errors/devskill-error.js';
import type { Skill } from '../models/skill.js';
import type { HostAdapter } from '../hosts/host-adapter.js';

export interface RunSkillOptions {
  args: readonly string[];
  cwd: string;
  dryRun: boolean;
}

export class SkillRunner {
  async run(
    skill: Skill,
    host: HostAdapter,
    options: RunSkillOptions,
  ): Promise<void> {
    const prompt = host.invocation(skill.name, options.args);
    if (options.dryRun) {
      process.stdout.write(`${host.executable} ${JSON.stringify(prompt)}\n`);
      return;
    }

    try {
      await execa(host.executable, [prompt], {
        cwd: options.cwd,
        stdio: 'inherit',
        reject: true,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        throw new DevskillError(
          `Executável não encontrado no PATH: ${host.executable}`,
          'HOST_NOT_FOUND',
        );
      }
      throw error;
    }
  }
}
