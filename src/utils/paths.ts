import { homedir } from 'node:os';
import { resolve } from 'node:path';

export interface PathContext {
  projectRoot: string;
  userHome: string;
  codexSkillsDirectory?: string;
  claudeSkillsDirectory?: string;
}

export function createPathContext(projectRoot = process.cwd()): PathContext {
  return {
    projectRoot: resolve(projectRoot),
    userHome: homedir(),
  };
}
