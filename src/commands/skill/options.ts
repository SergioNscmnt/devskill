import { resolve } from 'node:path';
import { bundledSkillsDirectory } from '../../core/bundled-skill.js';
import { loadConfig } from '../../core/config-loader.js';

export interface CatalogOptions {
  source?: string;
}

export async function catalogRoot(options: CatalogOptions): Promise<string> {
  if (options.source) {
    return resolve(options.source);
  }

  if (process.env.DEVSKILL_SKILLS_DIR) {
    return resolve(process.env.DEVSKILL_SKILLS_DIR);
  }

  const config = await loadConfig();
  if (config.skillsDir) {
    return config.skillsDir;
  }

  return bundledSkillsDirectory();
}

export function wantsAll(skillName: string | undefined, all: boolean): boolean {
  return all || skillName === 'all';
}
