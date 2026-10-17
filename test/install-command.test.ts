import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstat, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, it } from 'node:test';

const execFileAsync = promisify(execFile);
const cliPath = fileURLToPath(new URL('../src/cli.ts', import.meta.url));
const tsxPath = fileURLToPath(import.meta.resolve('tsx'));

describe('comando install global', () => {
  it('instala a skill no escopo global dos dois agentes', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devskill-install-'));
    const home = join(root, 'home');
    await mkdir(home);
    const source = await readFile(join(process.cwd(), 'skills', 'backend', 'SKILL.md'));
    const sha = createHash('sha1').update(`blob ${source.length}\0`).update(source).digest('hex');
    const mockPath = join(root, 'mock-github.mjs');
    await writeFile(mockPath, `
const sha = ${JSON.stringify(sha)};
const content = ${JSON.stringify(source.toString('base64'))};
globalThis.fetch = async (input) => {
  const url = String(input);
  if (url.endsWith('/git/trees/main?recursive=1')) return Response.json({ truncated: false, tree: [
    { path: 'skills/backend/SKILL.md', type: 'blob', mode: '100644', size: ${source.length}, sha },
  ] });
  if (url.endsWith('/git/blobs/' + sha)) return Response.json({ encoding: 'base64', content });
  return new Response(null, { status: 404 });
};
`);

    const env = {
      ...process.env,
      HOME: home,
      XDG_CONFIG_HOME: join(root, 'config'),
      XDG_CACHE_HOME: join(root, 'cache'),
      CODEX_THREAD_ID: 'test-thread',
      DEVSKILL_CODEX_SKILLS_DIR: join(home, '.agents', 'skills'),
      DEVSKILL_CLAUDE_SKILLS_DIR: join(home, '.claude', 'skills'),
    };
    delete env.DEVSKILL_SKILLS_DIR;
    delete env.NODE_TEST_CONTEXT;

    await execFileAsync(
      process.execPath,
      ['--import', tsxPath, '--import', mockPath, cliPath, 'install', 'backend'],
      { cwd: root, env },
    );

    const codex = join(home, '.agents', 'skills', 'devskill-backend');
    const claude = join(home, '.claude', 'skills', 'devskill_backend');
    assert.equal((await lstat(codex)).isDirectory(), true);
    assert.equal((await lstat(claude)).isDirectory(), true);
    assert.match(await readFile(join(codex, 'SKILL.md'), 'utf8'), /name: devskill-backend/);
    assert.match(await readFile(join(claude, 'SKILL.md'), 'utf8'), /name: backend/);
  });
});
