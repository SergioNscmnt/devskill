import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function defaultCatalogRoot(): string {
  const override = process.env.DEVSKILL_SKILLS_DIR;
  if (override) {
    return resolve(override);
  }

  const moduleDirectory = dirname(fileURLToPath(import.meta.url));
  return resolve(moduleDirectory, '../../skills');
}

export interface PathContext {
  projectRoot: string;
  userHome: string;
}

export function createPathContext(projectRoot = process.cwd()): PathContext {
  return {
    projectRoot: resolve(projectRoot),
    userHome: homedir(),
  };
}
