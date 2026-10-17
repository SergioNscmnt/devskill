import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { DevskillError } from '../errors/devskill-error.js';
import type { Skill } from '../models/skill.js';
import { loadSkill } from './skill-loader.js';

export class LocalSkillCatalog {
  readonly root: string;

  constructor(root: string) {
    this.root = resolve(root);
  }

  async list(): Promise<Skill[]> {
    let entries;
    try {
      entries = await readdir(this.root, { withFileTypes: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new DevskillError(
          `Catálogo de skills não encontrado: ${this.root}`,
          'CATALOG_NOT_FOUND',
        );
      }
      throw error;
    }

    const skills = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
        .map((entry) => loadSkill(join(this.root, entry.name))),
    );

    return skills.sort((left, right) => left.name.localeCompare(right.name));
  }

  async get(name: string): Promise<Skill> {
    const skills = await this.list();
    const skill = skills.find((candidate) => candidate.name === name);
    if (!skill) {
      throw new DevskillError(
        `Skill não encontrada no catálogo: ${name}`,
        'SKILL_NOT_FOUND',
      );
    }
    return skill;
  }
}
