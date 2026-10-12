import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import {
  detectHostForSkill,
  resolveHostTarget,
} from '../src/core/host-detector.js';
import { SkillInstaller } from '../src/core/skill-installer.js';
import { loadSkill } from '../src/core/skill-loader.js';
import { claudeAdapter } from '../src/hosts/claude.adapter.js';
import { codexAdapter } from '../src/hosts/codex.adapter.js';

describe('detecção automática do agente', () => {
  it('detecta o Codex pelo ambiente da sessão', async () => {
    assert.equal(
      await resolveHostTarget(undefined, {}, { CODEX_THREAD_ID: 'thread' }),
      'codex',
    );
  });

  it('detecta o Claude Code pelo ambiente da sessão', async () => {
    assert.equal(
      await resolveHostTarget(undefined, {}, { CLAUDECODE: '1' }),
      'claude',
    );
  });

  it('usa o agente configurado fora de uma sessão', async () => {
    assert.equal(
      await resolveHostTarget(undefined, { defaultAgent: 'claude' }, {}),
      'claude',
    );
  });

  it('usa o único agente disponível fora de uma sessão', async () => {
    assert.equal(
      await resolveHostTarget(
        undefined,
        {},
        {},
        async (host) => host.name === 'codex',
      ),
      'codex',
    );
  });

  it('preserva --target como substituição explícita', async () => {
    assert.equal(
      await resolveHostTarget('all', {}, { CODEX_THREAD_ID: 'thread' }),
      'all',
    );
  });

  it('rejeita um ambiente ambíguo', async () => {
    await assert.rejects(
      resolveHostTarget(
        undefined,
        {},
        { CODEX_THREAD_ID: 'thread', CLAUDECODE: '1' },
      ),
      /sinais do Codex e do Claude Code/,
    );
  });

  it('usa a preferência configurada em um ambiente ambíguo', async () => {
    assert.equal(
      await resolveHostTarget(
        undefined,
        { defaultAgent: 'claude' },
        { CODEX_THREAD_ID: 'thread', CLAUDECODE: '1' },
      ),
      'claude',
    );
  });

  it('seleciona o único agente no qual a skill foi instalada', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devskill-host-detector-'));
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
    await installer.install(skill, codexAdapter, 'user');

    const host = await detectHostForSkill(skill, installer, {}, 'user');
    assert.equal(host.name, 'codex');
  });

  it('usa o agente padrão quando a skill está instalada nos dois hosts', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devskill-host-detector-'));
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
    await installer.install(skill, codexAdapter, 'user');
    await installer.install(skill, claudeAdapter, 'user');

    const host = await detectHostForSkill(skill, installer, {
      defaultAgent: 'claude',
    }, 'user');
    assert.equal(host.name, 'claude');
  });
});
