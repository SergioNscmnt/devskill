import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';
import { DevskillError } from '../errors/devskill-error.js';

const configSchema = z
  .object({
    skillsDir: z.string().min(1).optional(),
    defaultAgent: z.enum(['codex', 'claude']).optional(),
  })
  .strict();

export type DevskillConfig = z.infer<typeof configSchema>;

export function defaultConfigPath(): string {
  const configHome =
    process.env.XDG_CONFIG_HOME ??
    (process.platform === 'win32' ? process.env.APPDATA : undefined) ??
    join(homedir(), '.config');

  return join(configHome, 'devskill', 'config.yaml');
}

export async function loadConfig(
  configPath = defaultConfigPath(),
): Promise<DevskillConfig> {
  let content: string;
  try {
    content = await readFile(configPath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {};
    }
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = yaml.load(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new DevskillError(
      `Configuração YAML inválida em ${configPath}: ${message}`,
      'INVALID_CONFIG',
    );
  }

  const result = configSchema.safeParse(parsed ?? {});
  if (!result.success) {
    throw new DevskillError(
      `Configuração inválida em ${configPath}: ${result.error.issues[0]?.message ?? 'valor não aceito'}`,
      'INVALID_CONFIG',
    );
  }

  return result.data;
}

export async function saveSkillsDirectory(
  directory: string,
  configPath = defaultConfigPath(),
): Promise<string> {
  const config = await loadConfig(configPath);
  const skillsDir = resolve(directory);

  await mkdir(dirname(configPath), { recursive: true });
  await writeFile(
    configPath,
    yaml.dump({ ...config, skillsDir }, { lineWidth: -1 }),
    'utf8',
  );

  return skillsDir;
}

export async function saveDefaultAgent(
  defaultAgent: NonNullable<DevskillConfig['defaultAgent']>,
  configPath = defaultConfigPath(),
): Promise<void> {
  const config = await loadConfig(configPath);
  await mkdir(dirname(configPath), { recursive: true });
  await writeFile(
    configPath,
    yaml.dump({ ...config, defaultAgent }, { lineWidth: -1 }),
    'utf8',
  );
}
