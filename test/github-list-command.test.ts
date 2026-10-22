import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { Command } from 'commander';
import { registerGlobalCommands } from '../src/commands/global.js';

test('list marca skill remota nova, list update baixa e install usa o cache', async () => {
  const root = await mkdtemp(join(tmpdir(), 'devskill-list-'));
  let bytes = Buffer.from('---\nname: nova\ndescription: Uma skill nova.\n---\n\n# Nova\n');
  const sha = () => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  const commitSha = 'a'.repeat(40);
  const treeSha = 'b'.repeat(40);
  const previousFetch = globalThis.fetch;
  const previousWrite = process.stdout.write;
  const previousEnv = {
    XDG_CACHE_HOME: process.env.XDG_CACHE_HOME,
    DEVSKILL_SKILLS_DIR: process.env.DEVSKILL_SKILLS_DIR,
    DEVSKILL_CODEX_SKILLS_DIR: process.env.DEVSKILL_CODEX_SKILLS_DIR,
    DEVSKILL_CLAUDE_SKILLS_DIR: process.env.DEVSKILL_CLAUDE_SKILLS_DIR,
  };
  process.env.XDG_CACHE_HOME = join(root, 'cache');
  delete process.env.DEVSKILL_SKILLS_DIR;
  process.env.DEVSKILL_CODEX_SKILLS_DIR = join(root, 'agents');
  process.env.DEVSKILL_CLAUDE_SKILLS_DIR = join(root, 'claude');
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.endsWith('/commits/main')) return Response.json({ sha: commitSha, commit: { tree: { sha: treeSha } } });
    if (url.endsWith('/git/trees/main?recursive=1') || url.endsWith(`/git/trees/${treeSha}?recursive=1`)) return Response.json({ truncated: false, tree: [
      { path: 'skills/nova/SKILL.md', type: 'blob', mode: '100644', size: bytes.length, sha: sha() },
    ] });
    if (url.endsWith(`/${commitSha}/skills/nova/SKILL.md`)) return new Response(bytes);
    return new Response(null, { status: 404 });
  };

  let output = '';
  process.stdout.write = ((chunk: string | Uint8Array) => { output += String(chunk); return true; }) as typeof process.stdout.write;
  const run = async (...args: string[]) => {
    output = '';
    const program = new Command();
    registerGlobalCommands(program);
    await program.parseAsync(args, { from: 'user' });
    return output;
  };

  try {
    assert.match(await run('list'), /nova\s+\(new\)/);
    assert.match(await run('list', 'update'), /Catálogo atualizado com 1 skill/);
    const after = await run('list');
    assert.match(after, /nova\s+\(install\)/);
    assert.doesNotMatch(after, /\(new\)/);
    process.env.DEVSKILL_SKILLS_DIR = join(root, 'catalogo-local-inexistente');
    assert.match(await run('list'), /nova\s+\(install\)/);
    delete process.env.DEVSKILL_SKILLS_DIR;
    await run('install', 'nova', '--host', 'codex');
    const installedPath = join(root, 'agents', 'devskill-nova', 'SKILL.md');
    assert.match(await readFile(installedPath, 'utf8'), /name: devskill-nova/);
    bytes = Buffer.from('---\nname: nova\ndescription: Versão atualizada.\n---\n\n# Nova\n');
    const updated = await run('update');
    assert.match(updated, /nova → codex: updated/);
    assert.match(updated, /npm install @jsndev\/devskill@latest/);
    assert.match(await readFile(installedPath, 'utf8'), /Versão atualizada/);
    await assert.rejects(readFile(join(root, 'claude', 'devskill_nova', 'SKILL.md'), 'utf8'), { code: 'ENOENT' });
    await writeFile(installedPath, 'edição local');
    await assert.rejects(run('update'), /arquivos alterados ou adicionais/);
    assert.equal(await readFile(installedPath, 'utf8'), 'edição local');
    globalThis.fetch = async () => { throw new Error('sem rede'); };
    await assert.rejects(run('list'), /Falha ao consultar o GitHub/);
  } finally {
    process.stdout.write = previousWrite;
    globalThis.fetch = previousFetch;
    for (const [key, value] of Object.entries(previousEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await rm(root, { recursive: true, force: true });
  }
});
