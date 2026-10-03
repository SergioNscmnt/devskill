import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { lstat, mkdir, mkdtemp, readlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, it } from 'node:test';
import { bundledSkillsDirectory } from '../src/core/bundled-skill.js';

const execFileAsync = promisify(execFile);
const cliPath = fileURLToPath(new URL('../src/cli.ts', import.meta.url));
const tsxPath = fileURLToPath(import.meta.resolve('tsx'));

describe('comando install', () => {
  it('instala uma skill do catálogo empacotado sem configuração', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devskill-install-'));
    const home = join(root, 'home');
    await mkdir(home);

    const env = {
      ...process.env,
      HOME: home,
      XDG_CONFIG_HOME: join(root, 'config'),
      CODEX_THREAD_ID: 'test-thread',
    };
    delete env.DEVSKILL_SKILLS_DIR;
    delete env.NODE_TEST_CONTEXT;

    await execFileAsync(
      process.execPath,
      ['--import', tsxPath, cliPath, 'install', 'backend'],
      { cwd: root, env },
    );

    const destination = join(home, '.agents', 'skills', 'backend');
    assert.equal((await lstat(destination)).isSymbolicLink(), true);
    assert.equal(
      resolve(join(destination, '..'), await readlink(destination)),
      resolve(bundledSkillsDirectory(), 'backend'),
    );
  });
});
