import { createHash } from 'node:crypto';
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  rm,
  rmdir,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import type { Skill } from '../models/skill.js';
import type { HostName } from '../models/skill.js';
import type { PathContext } from '../utils/paths.js';
import { DevskillError } from '../errors/devskill-error.js';

const marker = '.devskill-managed.json';
type Manifest = { source: string; files: Record<string, string> };

export function globalSkillsDirectory(host: HostName, context: PathContext): string {
  if (host === 'codex') {
    return resolve(context.codexSkillsDirectory ?? process.env.DEVSKILL_CODEX_SKILLS_DIR ?? join(context.userHome, '.agents', 'skills'));
  }
  const claudeHome = process.env.CLAUDE_CONFIG_DIR ?? join(context.userHome, '.claude');
  return resolve(context.claudeSkillsDirectory ?? process.env.DEVSKILL_CLAUDE_SKILLS_DIR ?? join(claudeHome, 'skills'));
}

export function agentSkillName(skill: Pick<Skill, 'name'>, host: HostName): string {
  return host === 'codex' ? `devskill-${skill.name}` : `devskill_${skill.name}`;
}

function digest(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

async function collectFiles(root: string, current = root): Promise<string[]> {
  const entries = await readdir(current, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === marker) continue;
    const path = join(current, entry.name);
    const stats = await lstat(path);
    if (stats.isSymbolicLink()) {
      throw new DevskillError(`Link simbólico não permitido no catálogo: ${path}`, 'UNSAFE_SKILL_PATH');
    }
    if (stats.isDirectory()) files.push(...await collectFiles(root, path));
    else if (stats.isFile()) files.push(relative(root, path));
  }
  return files;
}

function rewriteFrontmatter(source: string, name: string): string {
  const match = source.match(/^(---\r?\n)([\s\S]*?)(\r?\n---(?:[ \t]*\r?\n|$))/);
  if (!match) throw new DevskillError('Frontmatter inválido para adaptação do agente', 'INVALID_SKILL');
  const updated = match[2]!.replace(/^name:\s*.*$/m, `name: ${name}`);
  return `${match[1]}${updated}${match[3]}${source.slice(match[0].length)}`;
}

async function readManifest(destination: string): Promise<Manifest | undefined> {
  try {
    const info = await lstat(destination);
    if (!info.isDirectory() || info.isSymbolicLink()) return undefined;
    const markerPath = join(destination, marker);
    const markerInfo = await lstat(markerPath);
    if (!markerInfo.isFile() || markerInfo.isSymbolicLink()) return undefined;
    const parsed: unknown = JSON.parse(await readFile(markerPath, 'utf8'));
    if (!parsed || typeof parsed !== 'object' || !('files' in parsed)) return undefined;
    return parsed as Manifest;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}

export class GlobalSkillManager {
  constructor(private readonly context: PathContext) {}

  destination(skill: Pick<Skill, 'name'>, host: HostName): string {
    return join(globalSkillsDirectory(host, this.context), agentSkillName(skill, host));
  }

  async installed(skill: Pick<Skill, 'name'>, host: HostName): Promise<boolean> {
    const destination = this.destination(skill, host);
    const manifest = await readManifest(destination);
    if (!manifest) return false;
    try {
      const content = await readFile(join(destination, 'SKILL.md'));
      return manifest.files['SKILL.md'] === digest(content);
    } catch {
      return false;
    }
  }

  async assertCanInstall(skill: Skill, host: HostName, sync = false): Promise<void> {
    const destination = this.destination(skill, host);
    const managed = await readManifest(destination);
    if (!managed) {
      try {
        await lstat(destination);
        throw new DevskillError(`Destino existente não gerenciado; preservado: ${destination}`, 'INSTALL_CONFLICT');
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
      return;
    }
    if (sync) {
      const files = await collectFiles(destination);
      const intact = files.length === Object.keys(managed.files).length && await Promise.all(files.map(async (item) => {
        try { return managed.files[item] === digest(await readFile(join(destination, item))); } catch { return false; }
      })).then((results) => results.every(Boolean));
      if (!intact) throw new DevskillError(`A instalação contém arquivos alterados ou adicionais; preservada: ${destination}`, 'MANAGED_SKILL_MODIFIED');
    }
  }

  async init(): Promise<string[]> {
    const paths = (['codex', 'claude'] as const).map((host) => globalSkillsDirectory(host, this.context));
    for (const path of paths) await mkdir(path, { recursive: true });
    return paths;
  }

  async install(skill: Skill, host: HostName, sync = false): Promise<'installed' | 'already-installed' | 'updated'> {
    const destination = this.destination(skill, host);
    const existing = await readManifest(destination);
    if (existing && !sync) return 'already-installed';
    await this.assertCanInstall(skill, host, sync);

    const parent = dirname(destination);
    await mkdir(parent, { recursive: true });
    const stage = join(parent, `.devskill-stage-${process.pid}-${Date.now()}`);
    await mkdir(stage, { recursive: false });
    try {
      const relativeFiles = await collectFiles(skill.directory);
      const hashes: Record<string, string> = {};
      for (const item of relativeFiles) {
        const target = resolve(stage, item);
        if (!target.startsWith(`${resolve(stage)}${sep}`)) throw new DevskillError('Caminho inválido na skill', 'UNSAFE_SKILL_PATH');
        await mkdir(dirname(target), { recursive: true });
        const sourcePath = join(skill.directory, item);
        const sourceInfo = await lstat(sourcePath);
        if (sourceInfo.isSymbolicLink() || !sourceInfo.isFile()) throw new DevskillError(`Arquivo auxiliar inseguro na skill: ${sourcePath}`, 'UNSAFE_SKILL_PATH');
        let bytes = await readFile(sourcePath);
        if (item === 'SKILL.md' && host === 'codex') bytes = Buffer.from(rewriteFrontmatter(bytes.toString('utf8'), agentSkillName(skill, host)));
        await writeFile(target, bytes, { flag: 'wx' });
        hashes[item] = digest(bytes);
      }
      await writeFile(join(stage, marker), JSON.stringify({ source: skill.name, files: hashes } satisfies Manifest), { flag: 'wx' });
      if (existing) {
        await this.removeManaged(skill, host);
      }
      const { rename } = await import('node:fs/promises');
      await rename(stage, destination);
      return existing ? 'updated' : 'installed';
    } catch (error) {
      await rm(stage, { recursive: true, force: true });
      throw error;
    }
  }

  async removeManaged(skill: Pick<Skill, 'name'>, host: HostName): Promise<boolean> {
    const destination = this.destination(skill, host);
    const manifest = await readManifest(destination);
    if (!manifest) return false;
    for (const [item, expected] of Object.entries(manifest.files)) {
      const path = resolve(destination, item);
      if (!path.startsWith(`${resolve(destination)}${sep}`)) continue;
      try {
        const info = await lstat(path);
        if (!info.isFile() || info.isSymbolicLink()) continue;
        if (digest(await readFile(path)) === expected) await unlink(path);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
    }
    await unlink(join(destination, marker));
    await pruneEmptyDirectories(destination);
    return true;
  }
}

async function pruneEmptyDirectories(directory: string): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.isSymbolicLink()) await pruneEmptyDirectories(join(directory, entry.name));
  }
  try { await rmdir(directory); } catch (error) {
    if (!['ENOTEMPTY', 'EEXIST'].includes((error as NodeJS.ErrnoException).code ?? '')) throw error;
  }
}
