import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { lstat, mkdir, mkdtemp, readFile } from 'node:fs/promises';
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

    const env = {
      ...process.env,
      HOME: home,
      XDG_CONFIG_HOME: join(root, 'config'),
      CODEX_THREAD_ID: 'test-thread',
      DEVSKILL_CODEX_SKILLS_DIR: join(home, '.agents', 'skills'),
      DEVSKILL_CLAUDE_SKILLS_DIR: join(home, '.claude', 'skills'),
    };
    delete env.DEVSKILL_SKILLS_DIR;
    delete env.NODE_TEST_CONTEXT;

    await execFileAsync(
      process.execPath,
      ['--import', tsxPath, cliPath, 'install', 'backend'],
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
