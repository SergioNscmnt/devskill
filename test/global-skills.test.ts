import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { LocalSkillCatalog } from '../src/core/local-skill-catalog.js';
import { GlobalSkillManager, agentSkillName, globalSkillsDirectory } from '../src/core/global-skills.js';

const context = (userHome: string) => ({
  projectRoot: join(userHome, 'project'), userHome,
  codexSkillsDirectory: join(userHome, '.agents', 'skills'),
  claudeSkillsDirectory: join(userHome, '.claude', 'skills'),
});
async function fixture(): Promise<{ root: string; catalog: LocalSkillCatalog; manager: GlobalSkillManager }> {
  const root = await mkdtemp(join(tmpdir(), 'devskill-global-'));
  const home = join(root, 'home');
  return { root, catalog: new LocalSkillCatalog(join(process.cwd(), 'skills')), manager: new GlobalSkillManager(context(home)) };
}

test('init prepara diretórios globais sem instalar skills e caminhos respeitam HOME/override', async () => {
  const f = await fixture();
  try {
    const paths = await f.manager.init();
    assert.equal(paths[0], globalSkillsDirectory('codex', context(join(f.root, 'home'))));
    assert.equal(paths[1], globalSkillsDirectory('claude', context(join(f.root, 'home'))));
    const backend = await f.catalog.get('backend');
    assert.equal(await f.manager.installed(backend, 'codex'), false);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test('instala uma e todas as skills, gera nomes nativos e é idempotente', async () => {
  const f = await fixture();
  try {
    const skills = await f.catalog.list();
    const backend = await f.catalog.get('backend');
    assert.equal(agentSkillName(backend, 'codex'), 'devskill-backend');
    assert.equal(agentSkillName(backend, 'claude'), 'devskill_backend');
    assert.equal(await f.manager.install(backend, 'codex'), 'installed');
    assert.equal(await f.manager.install(backend, 'codex'), 'already-installed');
    const codexManifest = await readFile(join(f.manager.destination(backend, 'codex'), 'SKILL.md'), 'utf8');
    const claudePath = f.manager.destination(backend, 'claude');
    await f.manager.install(backend, 'claude');
    const claudeManifest = await readFile(join(claudePath, 'SKILL.md'), 'utf8');
    assert.match(codexManifest, /name: devskill-backend/);
    assert.match(claudeManifest, /name: backend/);
    for (const skill of skills) for (const host of ['codex', 'claude'] as const) await f.manager.install(skill, host);
    for (const skill of skills) for (const host of ['codex', 'claude'] as const) assert.equal(await f.manager.installed(skill, host), true);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test('remove preserva arquivos de terceiros e edições locais', async () => {
  const f = await fixture();
  try {
    const skill = await f.catalog.get('backend');
    const destination = f.manager.destination(skill, 'codex');
    await mkdir(join(destination, 'references'), { recursive: true }).catch(() => undefined);
    await assert.rejects(f.manager.install(skill, 'codex'), /Destino existente não gerenciado/);
    await rm(destination, { recursive: true, force: true });
    await f.manager.install(skill, 'codex');
    await writeFile(join(destination, 'user-notes.md'), 'keep');
    const before = await readFile(join(destination, 'SKILL.md'), 'utf8');
    await writeFile(join(destination, 'SKILL.md'), `${before}\nlocal edit`);
    assert.equal(await f.manager.removeManaged(skill, 'codex'), true);
    assert.equal(await readFile(join(destination, 'user-notes.md'), 'utf8'), 'keep');
    assert.match(await readFile(join(destination, 'SKILL.md'), 'utf8'), /local edit/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test('catalogo reconhece nova pasta válida e rejeita SKILL.md inválido', async () => {
  const f = await fixture();
  try {
    const root = join(f.root, 'catalog');
    await mkdir(join(root, 'sample-skill'), { recursive: true });
    const manifest = join(root, 'sample-skill', 'SKILL.md');
    await writeFile(manifest, '---\nname: sample-skill\ndescription: Test sample skill.\n---\n\nDo the test.\n');
    assert.equal((await new LocalSkillCatalog(root).get('sample-skill')).name, 'sample-skill');
    await writeFile(manifest, 'not a valid skill');
    await assert.rejects(new LocalSkillCatalog(root).list(), /Frontmatter/);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});

test('remove all gerenciado', async () => {
  const f = await fixture();
  try {
    const skills = await f.catalog.list();
    for (const skill of skills) for (const host of ['codex', 'claude'] as const) await f.manager.install(skill, host);
    for (const skill of skills) for (const host of ['codex', 'claude'] as const) assert.equal(await f.manager.removeManaged(skill, host), true);
  } finally { await rm(f.root, { recursive: true, force: true }); }
});
