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

const commitSha = 'a'.repeat(40);
const treeSha = 'b'.repeat(40);

function githubFixture(files: Record<string, string>, requests: string[] = []): typeof fetch {
  const entries = Object.entries(files).map(([path, content]) => ({
    path: `skills/${path}`,
    type: 'blob',
    mode: '100644',
    size: Buffer.byteLength(content),
    sha: blob(content).sha,
  }));
  return async (input) => {
    const url = String(input);
    requests.push(url);
    if (url.endsWith('/commits/main')) {
      return Response.json({ sha: commitSha, commit: { tree: { sha: treeSha } } });
    }
    if (url.endsWith('/git/trees/main?recursive=1') || url.endsWith(`/git/trees/${treeSha}?recursive=1`)) {
      return Response.json({ truncated: false, tree: entries });
    }
    const path = url.split(`/${commitSha}/`)[1];
    const entry = path ? files[decodeURIComponent(path).slice('skills/'.length)] : undefined;
    if (entry !== undefined) {
      return new Response(blob(entry).bytes);
    }
    return new Response(null, { status: 404 });
  };
}

test('catálogo GitHub detecta skills novas e atualiza arquivos auxiliares no cache', async () => {
  const root = await mkdtemp(join(tmpdir(), 'devskill-github-'));
  const destination = join(root, 'skills');
  const firstRequests: string[] = [];
  const first = new SkillCatalog(githubFixture({
    'backend/SKILL.md': '---\nname: backend\ndescription: Backend.\n---\n\n# Backend\n',
    'backend/references/guide.md': 'Guia inicial',
  }, firstRequests));
  const requests: string[] = [];
  const second = new SkillCatalog(githubFixture({
    'backend/SKILL.md': '---\nname: backend\ndescription: Backend atualizado.\n---\n\n# Backend\n',
    'backend/references/guide.md': 'Guia atualizado',
    'nova/SKILL.md': '---\nname: nova\ndescription: Skill nova.\n---\n\n# Nova\n',
  }, requests));
  try {
    assert.deepEqual(await first.list(), ['backend']);
    assert.deepEqual(firstRequests, ['https://api.github.com/repos/SergioNscmnt/devskill/git/trees/main?recursive=1']);
    assert.deepEqual(await first.update(destination), ['backend']);
    assert.deepEqual(await second.list(), ['backend', 'nova']);
    assert.deepEqual(await second.update(destination), ['backend', 'nova']);
    assert.deepEqual((await new LocalSkillCatalog(destination).list()).map((skill) => skill.name), ['backend', 'nova']);
    assert.equal(await readFile(join(destination, 'backend', 'references', 'guide.md'), 'utf8'), 'Guia atualizado');
    const downloads = requests.filter((url) => url.startsWith('https://raw.githubusercontent.com/')).length;
    await second.update(destination);
    assert.equal(requests.filter((url) => url.startsWith('https://raw.githubusercontent.com/')).length, downloads);
    assert.equal(requests.filter((url) => url.includes('/git/blobs/')).length, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('usa token só na API e informa quando a cota anônima acaba', async () => {
  const root = await mkdtemp(join(tmpdir(), 'devskill-github-'));
  const source = githubFixture({
    'backend/SKILL.md': '---\nname: backend\ndescription: Backend.\n---\n\n# Backend\n',
  });
  const headers: Array<{ url: string; authorization: string | null; apiVersion: string | null }> = [];
  const fetcher: typeof fetch = async (input, init) => {
    const requestHeaders = new Headers(init?.headers);
    headers.push({
      url: String(input),
      authorization: requestHeaders.get('Authorization'),
      apiVersion: requestHeaders.get('X-GitHub-Api-Version'),
    });
    return source(input, init);
  };
  try {
    await new SkillCatalog(fetcher, 'test-token').updateSkill('backend', join(root, 'skills'));
    assert.equal(headers.filter((item) => item.url.startsWith('https://api.github.com/')).every((item) => item.authorization === 'Bearer test-token'), true);
    assert.equal(headers.filter((item) => item.url.startsWith('https://api.github.com/')).every((item) => item.apiVersion === '2026-03-10'), true);
    assert.equal(headers.filter((item) => item.url.startsWith('https://raw.githubusercontent.com/')).every((item) => item.authorization === null), true);
    const limited = new SkillCatalog(async () => new Response(null, {
      status: 403, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1792274431' },
    }));
    await assert.rejects(limited.list(), /Limite da API do GitHub atingido\. Renovação da cota: 2026-10-17T22:00:31\.000Z/);
    const temporarilyLimited = new SkillCatalog(async () => new Response(null, {
      status: 429, headers: { 'retry-after': '30' },
    }));
    await assert.rejects(temporarilyLimited.list(), /Tente novamente após 30 segundos/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('atualiza apenas a skill escolhida e preserva as outras no cache', async () => {
  const root = await mkdtemp(join(tmpdir(), 'devskill-github-'));
  const destination = join(root, 'skills');
  const first = new SkillCatalog(githubFixture({
    'backend/SKILL.md': '---\nname: backend\ndescription: Backend inicial.\n---\n\n# Backend\n',
    'nova/SKILL.md': '---\nname: nova\ndescription: Nova inicial.\n---\n\n# Nova\n',
  }));
  const requests: string[] = [];
  const second = new SkillCatalog(githubFixture({
    'backend/SKILL.md': '---\nname: backend\ndescription: Backend remoto atualizado.\n---\n\n# Backend\n',
    'nova/SKILL.md': '---\nname: nova\ndescription: Nova atualizada.\n---\n\n# Nova\n',
  }, requests));
  try {
    await first.update(destination);
    await second.updateSkill('nova', destination);
    assert.match(await readFile(join(destination, 'backend', 'SKILL.md'), 'utf8'), /Backend inicial/);
    assert.match(await readFile(join(destination, 'nova', 'SKILL.md'), 'utf8'), /Nova atualizada/);
    assert.equal(requests.filter((url) => url.startsWith('https://raw.githubusercontent.com/')).length, 1);
    await assert.rejects(second.updateSkill('ausente', destination), /Skill não encontrada/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('falha no download preserva o catálogo anterior', async () => {
  const root = await mkdtemp(join(tmpdir(), 'devskill-github-'));
  const destination = join(root, 'skills');
  const content = '---\nname: backend\ndescription: Backend.\n---\n\n# Backend\n';
  const updatedContent = content.replace('Backend.', 'Backend atualizado.');
  const valid = new SkillCatalog(githubFixture({ 'backend/SKILL.md': content }));
  try {
    await valid.update(destination);
    const broken = new SkillCatalog(async (input) => {
      if (String(input).endsWith('/commits/main')) {
        return Response.json({ sha: commitSha, commit: { tree: { sha: treeSha } } });
      }
      if (String(input).includes('/git/trees/')) {
        return Response.json({ truncated: false, tree: [{
          path: 'skills/backend/SKILL.md', type: 'blob', mode: '100644', sha: blob(updatedContent).sha, size: Buffer.byteLength(updatedContent),
        }] });
      }
      return new Response('tampered');
    });
    await assert.rejects(broken.update(destination), /Conteúdo inválido/);
    assert.equal(await readFile(join(destination, 'backend', 'SKILL.md'), 'utf8'), content);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
