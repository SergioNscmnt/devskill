import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { loadConfig, saveSkillsDirectory } from '../src/core/config-loader.js';

describe('configuração do catálogo', () => {
  it('persiste a pasta local de skills', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devskill-config-'));
    const configPath = join(root, 'config', 'config.yaml');
    const skillsDir = await saveSkillsDirectory('../minhas-skills', configPath);

    assert.equal(skillsDir, resolve('../minhas-skills'));
    assert.deepEqual(await loadConfig(configPath), { skillsDir });
  });

  it('rejeita configurações inválidas', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devskill-config-'));
    const configPath = join(root, 'config.yaml');
    await writeFile(configPath, 'skillsDir: 42\n');

    await assert.rejects(loadConfig(configPath), /Configuração inválida/);
  });
});
