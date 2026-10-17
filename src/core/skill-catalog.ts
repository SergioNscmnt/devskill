import { createHash, randomUUID } from 'node:crypto';
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { DevskillError } from '../errors/devskill-error.js';
import { LocalSkillCatalog } from './local-skill-catalog.js';

const apiRoot = 'https://api.github.com/repos/SergioNscmnt/devskill';
const skillNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const maxFileSize = 5 * 1024 * 1024;
const maxCatalogSize = 20 * 1024 * 1024;

interface TreeEntry {
  path: string;
  type: string;
  mode: string;
  sha: string;
  size?: number;
}

export function cachedSkillsDirectory(): string {
  const cacheHome = process.env.XDG_CACHE_HOME ?? join(homedir(), '.cache');
  return join(cacheHome, 'devskill', 'skills');
}

async function githubJson(url: string, fetcher: typeof fetch): Promise<unknown> {
  let response: Response;
  try {
    response = await fetcher(url, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'devskill-cli' },
      signal: AbortSignal.timeout(10000),
    });
  } catch (error) {
    throw new DevskillError(`Falha ao consultar o GitHub: ${error instanceof Error ? error.message : String(error)}`, 'GITHUB_UNAVAILABLE');
  }
  if (!response.ok) {
    throw new DevskillError(`GitHub respondeu HTTP ${response.status} ao consultar o catálogo`, 'GITHUB_UNAVAILABLE');
  }
  return response.json();
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
        typeof entry.sha !== 'string' || !/^[a-f0-9]{40}$/.test(entry.sha) ||
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

async function downloadBlob(sha: string, fetcher: typeof fetch): Promise<Buffer> {
  const raw = await githubJson(`${apiRoot}/git/blobs/${sha}`, fetcher);
  if (!raw || typeof raw !== 'object' || !('encoding' in raw) || raw.encoding !== 'base64' ||
      !('content' in raw) || typeof raw.content !== 'string') {
    throw new DevskillError(`Blob inválido no GitHub: ${sha}`, 'INVALID_REMOTE_CATALOG');
  }
  const encoded = raw.content.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) {
    throw new DevskillError(`Blob inválido no GitHub: ${sha}`, 'INVALID_REMOTE_CATALOG');
  }
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length > maxFileSize) {
    throw new DevskillError(`Blob excede o tamanho permitido: ${sha}`, 'INVALID_REMOTE_CATALOG');
  }
  const actualSha = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  if (actualSha !== sha) {
    throw new DevskillError(`Hash inválido para blob ${sha}`, 'INVALID_REMOTE_CATALOG');
  }
  return bytes;
}

export class SkillCatalog {
  constructor(private readonly fetcher: typeof fetch = fetch) {}

  async files(): Promise<TreeEntry[]> {
    return skillFiles(await githubJson(`${apiRoot}/git/trees/main?recursive=1`, this.fetcher));
  }

  async list(): Promise<string[]> {
    const files = await this.files();
    return [...new Set(files
      .filter((file) => /^skills\/[^/]+\/SKILL\.md$/.test(file.path))
      .map((file) => file.path.split('/')[1]!))].sort();
  }

  async update(destination = cachedSkillsDirectory()): Promise<string[]> {
    const files = await this.files();
    const names = [...new Set(files
      .filter((file) => /^skills\/[^/]+\/SKILL\.md$/.test(file.path))
      .map((file) => file.path.split('/')[1]!))].sort();
    if (names.length === 0) {
      throw new DevskillError('Nenhuma skill encontrada no GitHub', 'INVALID_REMOTE_CATALOG');
    }

    const parent = dirname(destination);
    const stage = join(parent, `.devskill-skills-${randomUUID()}`);
    const backup = join(parent, `.devskill-skills-backup-${randomUUID()}`);
    await mkdir(stage, { recursive: true });
    try {
      for (const file of files) {
        const relative = file.path.slice('skills/'.length);
        const target = join(stage, relative);
        await mkdir(dirname(target), { recursive: true });
        const bytes = await downloadBlob(file.sha, this.fetcher);
        if (bytes.length !== file.size) {
          throw new DevskillError(`Tamanho inválido para ${file.path}`, 'INVALID_REMOTE_CATALOG');
        }
        await writeFile(target, bytes, { flag: 'wx' });
      }
      await new LocalSkillCatalog(stage).list();
      await mkdir(parent, { recursive: true });
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
      return names;
    } finally {
      await rm(stage, { recursive: true, force: true });
    }
  }
}
