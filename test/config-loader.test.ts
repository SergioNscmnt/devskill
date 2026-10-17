import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { catalogRoot } from '../src/commands/skill/options.js';
import { bundledSkillsDirectory } from '../src/core/bundled-skill.js';
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

  it('usa o catálogo empacotado quando o catálogo configurado não existe', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devskill-config-'));
    await saveSkillsDirectory(join(root, 'ausente'), join(root, 'config', 'devskill', 'config.yaml'));
    const previousConfigHome = process.env.XDG_CONFIG_HOME;
    const previousSkillsDir = process.env.DEVSKILL_SKILLS_DIR;
    process.env.XDG_CONFIG_HOME = join(root, 'config');
    delete process.env.DEVSKILL_SKILLS_DIR;

    try {
      assert.equal(await catalogRoot({}), bundledSkillsDirectory());
    } finally {
      if (previousConfigHome === undefined) delete process.env.XDG_CONFIG_HOME;
      else process.env.XDG_CONFIG_HOME = previousConfigHome;
      if (previousSkillsDir === undefined) delete process.env.DEVSKILL_SKILLS_DIR;
      else process.env.DEVSKILL_SKILLS_DIR = previousSkillsDir;
    }
  });
});
