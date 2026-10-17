import { createHash, randomUUID } from 'node:crypto';
import { lstat, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { DevskillError } from '../errors/devskill-error.js';
import { LocalSkillCatalog } from './local-skill-catalog.js';

const apiRoot = 'https://api.github.com/repos/SergioNscmnt/devskill';
const apiVersion = '2026-03-10';
const rawRoot = 'https://raw.githubusercontent.com/SergioNscmnt/devskill';
const skillNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const shaPattern = /^[a-f0-9]{40}$/;
const maxFileSize = 5 * 1024 * 1024;
const maxCatalogSize = 20 * 1024 * 1024;

interface TreeEntry {
  path: string;
  type: string;
  mode: string;
  sha: string;
  size?: number;
}

interface Snapshot {
  commit: string;
  files: TreeEntry[];
}

export function cachedSkillsDirectory(): string {
  const cacheHome = process.env.XDG_CACHE_HOME ?? join(homedir(), '.cache');
  return join(cacheHome, 'devskill', 'skills');
}

function rateLimitReset(headers: Headers): string {
  const value = headers.get('x-ratelimit-reset');
  if (!value || !/^\d+$/.test(value)) return '';
  const date = new Date(Number(value) * 1000);
  return Number.isFinite(date.getTime()) ? ` Renovação da cota: ${date.toISOString()}.` : '';
}

async function githubJson(url: string, fetcher: typeof fetch, token?: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetcher(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'devskill-cli',
        'X-GitHub-Api-Version': apiVersion,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(10000),
    });
  } catch (error) {
    throw new DevskillError(`Falha ao consultar o GitHub: ${error instanceof Error ? error.message : String(error)}`, 'GITHUB_UNAVAILABLE');
  }
  if (!response.ok) {
    if ((response.status === 403 || response.status === 429) && response.headers.get('x-ratelimit-remaining') === '0') {
      const hint = token ? '' : ' Configure DEVSKILL_GITHUB_TOKEN para uma cota autenticada.';
      throw new DevskillError(`Limite da API do GitHub atingido.${rateLimitReset(response.headers)}${hint}`, 'GITHUB_UNAVAILABLE');
    }
    const retryAfter = response.headers.get('retry-after');
    if ((response.status === 403 || response.status === 429) && retryAfter && /^\d+$/.test(retryAfter)) {
      throw new DevskillError(`GitHub limitou temporariamente as consultas. Tente novamente após ${retryAfter} segundos.`, 'GITHUB_UNAVAILABLE');
    }
    throw new DevskillError(`GitHub respondeu HTTP ${response.status} ao consultar o catálogo`, 'GITHUB_UNAVAILABLE');
  }
  try {
    return await response.json();
  } catch {
    throw new DevskillError('Resposta inválida da API do GitHub', 'INVALID_REMOTE_CATALOG');
  }
}

function skillFiles(raw: unknown): TreeEntry[] {
  if (!raw || typeof raw !== 'object' || !('tree' in raw) || !Array.isArray(raw.tree) ||
      !('truncated' in raw) || raw.truncated !== false) {
    throw new DevskillError('Árvore de skills incompleta ou inválida no GitHub', 'INVALID_REMOTE_CATALOG');
  }

  const files: TreeEntry[] = [];
  let totalSize = 0;
  for (const entry of raw.tree) {
    if (!entry || typeof entry !== 'object' || typeof entry.path !== 'string' ||
        !entry.path.startsWith('skills/')) continue;
    const segments = entry.path.split('/');
    if (segments.length === 2 && entry.type === 'tree') continue;
    if (segments.length < 3 || !skillNamePattern.test(segments[1] ?? '') ||
        segments.some((segment: string) => !segment || segment === '.' || segment === '..' || segment.includes('\\'))) {
      throw new DevskillError(`Caminho inseguro no catálogo remoto: ${entry.path}`, 'INVALID_REMOTE_CATALOG');
    }
    if (entry.type === 'tree') continue;
    if (entry.type !== 'blob' || !['100644', '100755'].includes(entry.mode) ||
        typeof entry.sha !== 'string' || !shaPattern.test(entry.sha) ||
        !Number.isSafeInteger(entry.size) || entry.size < 0 || entry.size > maxFileSize) {
      throw new DevskillError(`Arquivo inválido no catálogo remoto: ${entry.path}`, 'INVALID_REMOTE_CATALOG');
    }
    totalSize += entry.size;
    if (totalSize > maxCatalogSize) {
      throw new DevskillError('Catálogo remoto excede o tamanho permitido', 'INVALID_REMOTE_CATALOG');
    }
    files.push(entry as TreeEntry);
  }
  return files;
}

function skillNames(files: TreeEntry[]): string[] {
  return [...new Set(files
    .filter((file) => /^skills\/[^/]+\/SKILL\.md$/.test(file.path))
    .map((file) => file.path.split('/')[1]!))].sort();
}

function blobSha(bytes: Buffer): string {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

async function cachedFile(file: TreeEntry, destination: string): Promise<Buffer | undefined> {
  const path = join(destination, file.path.slice('skills/'.length));
  try {
    if (!(await lstat(path)).isFile()) return undefined;
    const bytes = await readFile(path);
    return bytes.length === file.size && blobSha(bytes) === file.sha ? bytes : undefined;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}

async function downloadFile(file: TreeEntry, commit: string, fetcher: typeof fetch): Promise<Buffer> {
  const path = file.path.split('/').map(encodeURIComponent).join('/');
  let response: Response;
  try {
    response = await fetcher(`${rawRoot}/${commit}/${path}`, {
      headers: { 'User-Agent': 'devskill-cli' },
      signal: AbortSignal.timeout(10000),
    });
  } catch (error) {
    throw new DevskillError(`Falha ao baixar ${file.path}: ${error instanceof Error ? error.message : String(error)}`, 'GITHUB_UNAVAILABLE');
  }
  if (!response.ok) {
    throw new DevskillError(`GitHub respondeu HTTP ${response.status} ao baixar ${file.path}`, 'GITHUB_UNAVAILABLE');
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length !== file.size || bytes.length > maxFileSize || blobSha(bytes) !== file.sha) {
    throw new DevskillError(`Conteúdo inválido para ${file.path}`, 'INVALID_REMOTE_CATALOG');
  }
  return bytes;
}

async function stageFiles(files: TreeEntry[], stage: string, destination: string, commit: string, fetcher: typeof fetch): Promise<void> {
  for (const file of files) {
    const relative = file.path.slice('skills/'.length);
    const target = join(stage, relative);
    await mkdir(dirname(target), { recursive: true });
    const bytes = await cachedFile(file, destination) ?? await downloadFile(file, commit, fetcher);
    await writeFile(target, bytes, { flag: 'wx' });
  }
}

async function replaceDirectory(stage: string, destination: string, backup: string): Promise<void> {
  await mkdir(dirname(destination), { recursive: true });
  let hadExisting = false;
  try {
    await rename(destination, backup);
    hadExisting = true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  try {
    await rename(stage, destination);
  } catch (error) {
    if (hadExisting) await rename(backup, destination);
    throw error;
  }
  if (hadExisting) await rm(backup, { recursive: true, force: true });
}

export class SkillCatalog {
  constructor(
    private readonly fetcher: typeof fetch = fetch,
    private readonly token = process.env.DEVSKILL_GITHUB_TOKEN || process.env.GITHUB_TOKEN,
  ) {}

  private async snapshot(): Promise<Snapshot> {
    const raw = await githubJson(`${apiRoot}/commits/main`, this.fetcher, this.token);
    if (!raw || typeof raw !== 'object' || !('sha' in raw) || typeof raw.sha !== 'string' ||
        !shaPattern.test(raw.sha) || !('commit' in raw) || !raw.commit || typeof raw.commit !== 'object' ||
        !('tree' in raw.commit) || !raw.commit.tree || typeof raw.commit.tree !== 'object' ||
        !('sha' in raw.commit.tree) || typeof raw.commit.tree.sha !== 'string' || !shaPattern.test(raw.commit.tree.sha)) {
      throw new DevskillError('Commit inválido na API do GitHub', 'INVALID_REMOTE_CATALOG');
    }
    const tree = await githubJson(`${apiRoot}/git/trees/${raw.commit.tree.sha}?recursive=1`, this.fetcher, this.token);
    return { commit: raw.sha, files: skillFiles(tree) };
  }

  async list(): Promise<string[]> {
    const tree = await githubJson(`${apiRoot}/git/trees/main?recursive=1`, this.fetcher, this.token);
    return skillNames(skillFiles(tree));
  }

  async update(destination = cachedSkillsDirectory()): Promise<string[]> {
    const { commit, files } = await this.snapshot();
    const names = skillNames(files);
    if (names.length === 0) {
      throw new DevskillError('Nenhuma skill encontrada no GitHub', 'INVALID_REMOTE_CATALOG');
    }

    const parent = dirname(destination);
    const stage = join(parent, `.devskill-skills-${randomUUID()}`);
    const backup = join(parent, `.devskill-skills-backup-${randomUUID()}`);
    await mkdir(stage, { recursive: true });
    try {
      await stageFiles(files, stage, destination, commit, this.fetcher);
      await new LocalSkillCatalog(stage).list();
      await replaceDirectory(stage, destination, backup);
      return names;
    } finally {
      await rm(stage, { recursive: true, force: true });
    }
  }

  async updateSkill(name: string, destination = cachedSkillsDirectory()): Promise<void> {
    if (!skillNamePattern.test(name)) {
      throw new DevskillError(`Skill não encontrada no catálogo: ${name}`, 'SKILL_NOT_FOUND');
    }
    const { commit, files } = await this.snapshot();
    if (!skillNames(files).includes(name)) {
      throw new DevskillError(`Skill não encontrada no catálogo: ${name}`, 'SKILL_NOT_FOUND');
    }
    const selected = files.filter((file) => file.path.startsWith(`skills/${name}/`));
    const parent = dirname(destination);
    const stageRoot = join(parent, `.devskill-skill-${randomUUID()}`);
    const stage = join(stageRoot, name);
    const backup = join(parent, `.devskill-skill-backup-${randomUUID()}`);
    await mkdir(stage, { recursive: true });
    try {
      await stageFiles(selected, stageRoot, destination, commit, this.fetcher);
      await new LocalSkillCatalog(stageRoot).get(name);
      await mkdir(destination, { recursive: true });
      await replaceDirectory(stage, join(destination, name), backup);
    } finally {
      await rm(stageRoot, { recursive: true, force: true });
    }
  }
}
