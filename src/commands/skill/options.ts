import { resolve } from 'node:path';
import type { InstallScope, HostTarget } from '../../models/skill.js';
import { defaultCatalogRoot } from '../../utils/paths.js';

export interface CatalogOptions {
  source?: string;
  project?: string;
}

export interface TargetOptions extends CatalogOptions {
  target: HostTarget;
  scope: InstallScope;
}

export function catalogRoot(options: CatalogOptions): string {
  return options.source ? resolve(options.source) : defaultCatalogRoot();
}

export function projectRoot(options: CatalogOptions): string {
  return resolve(options.project ?? process.cwd());
}

export function wantsAll(skillName: string | undefined, all: boolean): boolean {
  return all || skillName === 'all';
}
