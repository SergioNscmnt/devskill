import { fileURLToPath } from 'node:url';
import type { Skill } from '../models/skill.js';
import { loadSkill } from './skill-loader.js';

export function bundledDevskillDirectory(): string {
  return fileURLToPath(
    new URL('../../agent-skill/devskill/', import.meta.url),
  );
}

export function bundledSkillsDirectory(): string {
  return fileURLToPath(new URL('../../skills/', import.meta.url));
}

export function loadBundledDevskill(): Promise<Skill> {
  return loadSkill(bundledDevskillDirectory());
}
