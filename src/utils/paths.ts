import { homedir } from 'node:os';
import { resolve } from 'node:path';

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
