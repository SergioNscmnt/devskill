import assert from 'node:assert/strict';
import { lstat, mkdtemp, mkdir, readlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { SkillInstaller } from '../src/core/skill-installer.js';
import { loadSkill } from '../src/core/skill-loader.js';
import { codexAdapter } from '../src/hosts/codex.adapter.js';

describe('SkillInstaller', () => {
  it('instala e remove somente o link gerenciado', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devskill-installer-'));
    const source = join(root, 'catalog', 'review');
    const project = join(root, 'project');
    await mkdir(source, { recursive: true });
    await mkdir(project);
    await writeFile(
      join(source, 'SKILL.md'),
      '---\nname: review\ndescription: Reviews changes.\n---\n\nReview.',
    );
    const skill = await loadSkill(source);
    const installer = new SkillInstaller({ projectRoot: project, userHome: root });

    const installed = await installer.install(skill, codexAdapter, 'project');
    assert.equal(installed.status, 'installed');
    assert.equal((await lstat(installed.destination)).isSymbolicLink(), true);
    assert.equal(resolve(join(installed.destination, '..'), await readlink(installed.destination)),
      resolve(source),
    );

    const removed = await installer.remove(skill, codexAdapter, 'project');
    assert.equal(removed.status, 'removed');
    await assert.rejects(lstat(removed.destination), { code: 'ENOENT' });
  });
});
