import assert from 'node:assert/strict';
import { lstat, mkdtemp, mkdir, readlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, it } from 'node:test';
import {
  bundledDevskillDirectory,
  bundledSkillsDirectory,
  loadBundledDevskill,
} from '../src/core/bundled-skill.js';
import { LocalSkillCatalog } from '../src/core/local-skill-catalog.js';
import { SkillInstaller } from '../src/core/skill-installer.js';
import { codexAdapter } from '../src/hosts/codex.adapter.js';

describe('skill roteadora devskill', () => {
  it('disponibiliza o catálogo padrão empacotado', async () => {
    const skills = await new LocalSkillCatalog(bundledSkillsDirectory()).list();

    assert.equal(skills.some((skill) => skill.name === 'backend'), true);
  });

  it('é uma Agent Skill válida e pode ser instalada no Codex', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devskill-bundled-'));
    const projectRoot = join(root, 'project');
    const userHome = join(root, 'home');
    await mkdir(projectRoot);
    await mkdir(userHome);
    const skill = await loadBundledDevskill();
    const installer = new SkillInstaller({ projectRoot, userHome });

    assert.equal(skill.name, 'devskill');

    const result = await installer.install(skill, codexAdapter, 'user');

    assert.equal(result.status, 'installed');
    assert.equal(result.destination.startsWith(userHome), true);
    assert.equal(result.destination.startsWith(projectRoot), false);
    assert.equal((await lstat(result.destination)).isSymbolicLink(), true);
    assert.equal(
      resolve(join(result.destination, '..'), await readlink(result.destination)),
      resolve(bundledDevskillDirectory()),
    );
  });
});
