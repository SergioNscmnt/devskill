import type { SkillFrontmatter } from '../schemas/skill-frontmatter.schema.js';

export interface Skill {
  name: string;
  title: string;
  description: string;
  directory: string;
  skillFile: string;
  content: string;
  frontmatter: SkillFrontmatter;
}

export type SkillOperationStatus =
  | 'installed'
  | 'already-installed'
  | 'updated'
  | 'removed'
  | 'not-installed';

export interface SkillOperationResult {
  skill: string;
  host: HostName;
  destination: string;
  status: SkillOperationStatus;
}

export type HostName = 'codex' | 'claude';
export type HostTarget = HostName | 'all';
export type InstallScope = 'project' | 'user';
