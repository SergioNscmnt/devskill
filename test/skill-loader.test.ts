import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { loadSkill } from '../src/core/skill-loader.js';

describe('loadSkill', () => {
  it('carrega uma skill Agent Skills válida', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devskill-loader-'));
    const directory = join(root, 'review');
    await mkdir(directory);
    await writeFile(
      join(directory, 'SKILL.md'),
      '---\nname: review\ndescription: Reviews changes.\n---\n\nReview the code.',
    );

    const skill = await loadSkill(directory);

    assert.equal(skill.name, 'review');
    assert.equal(skill.title, 'review');
    assert.equal(skill.content, 'Review the code.');
  });

  it('rejeita divergência entre name e pasta', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devskill-loader-'));
    const directory = join(root, 'review');
    await mkdir(directory);
    await writeFile(
      join(directory, 'SKILL.md'),
      '---\nname: other\ndescription: Reviews changes.\n---\n\nReview.',
    );

    await assert.rejects(
      loadSkill(directory),
      /deve estar em uma pasta com o mesmo nome/,
    );
  });
});
