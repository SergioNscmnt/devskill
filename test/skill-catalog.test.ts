import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { SkillCatalog } from '../src/core/skill-catalog.js';
import { LocalSkillCatalog } from '../src/core/local-skill-catalog.js';

function blob(content: string): { sha: string; bytes: Buffer } {
  const bytes = Buffer.from(content);
  return {
    sha: createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
    bytes,
  };
}

function githubFixture(files: Record<string, string>): typeof fetch {
  const entries = Object.entries(files).map(([path, content]) => ({
    path: `skills/${path}`,
    type: 'blob',
    mode: '100644',
    size: Buffer.byteLength(content),
    sha: blob(content).sha,
  }));
  return async (input) => {
    const url = String(input);
    if (url.endsWith('/git/trees/main?recursive=1')) {
      return Response.json({ truncated: false, tree: entries });
    }
    const sha = url.split('/').at(-1);
    const entry = Object.values(files).find((content) => blob(content).sha === sha);
    if (entry !== undefined) {
      return Response.json({ encoding: 'base64', content: blob(entry).bytes.toString('base64') });
    }
    return new Response(null, { status: 404 });
  };
}

test('catálogo GitHub detecta skills novas e atualiza arquivos auxiliares no cache', async () => {
  const root = await mkdtemp(join(tmpdir(), 'devskill-github-'));
  const destination = join(root, 'skills');
  const first = new SkillCatalog(githubFixture({
    'backend/SKILL.md': '---\nname: backend\ndescription: Backend.\n---\n\n# Backend\n',
    'backend/references/guide.md': 'Guia inicial',
  }));
  const second = new SkillCatalog(githubFixture({
    'backend/SKILL.md': '---\nname: backend\ndescription: Backend atualizado.\n---\n\n# Backend\n',
    'backend/references/guide.md': 'Guia atualizado',
    'nova/SKILL.md': '---\nname: nova\ndescription: Skill nova.\n---\n\n# Nova\n',
  }));
  try {
    assert.deepEqual(await first.list(), ['backend']);
    assert.deepEqual(await first.update(destination), ['backend']);
    assert.deepEqual(await second.list(), ['backend', 'nova']);
    assert.deepEqual(await second.update(destination), ['backend', 'nova']);
    assert.deepEqual((await new LocalSkillCatalog(destination).list()).map((skill) => skill.name), ['backend', 'nova']);
    assert.equal(await readFile(join(destination, 'backend', 'references', 'guide.md'), 'utf8'), 'Guia atualizado');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('falha no download preserva o catálogo anterior', async () => {
  const root = await mkdtemp(join(tmpdir(), 'devskill-github-'));
  const destination = join(root, 'skills');
  const content = '---\nname: backend\ndescription: Backend.\n---\n\n# Backend\n';
  const valid = new SkillCatalog(githubFixture({ 'backend/SKILL.md': content }));
  try {
    await valid.update(destination);
    const broken = new SkillCatalog(async (input) => {
      if (String(input).includes('/git/trees/')) {
        return Response.json({ truncated: false, tree: [{
          path: 'skills/backend/SKILL.md', type: 'blob', mode: '100644', sha: blob(content).sha, size: Buffer.byteLength(content),
        }] });
      }
      return Response.json({ encoding: 'base64', content: Buffer.from('tampered').toString('base64') });
    });
    await assert.rejects(broken.update(destination), /Hash inválido/);
    assert.equal(await readFile(join(destination, 'backend', 'SKILL.md'), 'utf8'), content);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
