import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { load } from 'js-yaml';
import { ZodError } from 'zod';
import { DevskillError } from '../errors/devskill-error.js';
import type { Skill } from '../models/skill.js';
import { skillFrontmatterSchema } from '../schemas/skill-frontmatter.schema.js';

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

function describeZodError(error: ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || 'frontmatter'}: ${issue.message}`)
    .join('; ');
}

export async function loadSkill(directory: string): Promise<Skill> {
  const skillFile = join(directory, 'SKILL.md');
  let source: string;

  try {
    source = await readFile(skillFile, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new DevskillError(
        `SKILL.md não encontrado em ${directory}`,
        'SKILL_FILE_NOT_FOUND',
      );
    }
    throw error;
  }

  const match = source.match(frontmatterPattern);
  if (!match?.[1]) {
    throw new DevskillError(
      `Frontmatter YAML ausente ou inválido em ${skillFile}`,
      'INVALID_FRONTMATTER',
    );
  }

  let rawFrontmatter: unknown;
  try {
    rawFrontmatter = load(match[1]);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new DevskillError(
      `YAML inválido em ${skillFile}: ${detail}`,
      'INVALID_FRONTMATTER',
    );
  }

  let frontmatter;
  try {
    frontmatter = skillFrontmatterSchema.parse(rawFrontmatter);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new DevskillError(
        `Frontmatter inválido em ${skillFile}: ${describeZodError(error)}`,
        'INVALID_SKILL',
      );
    }
    throw error;
  }

  const directoryName = basename(directory);
  if (directoryName !== frontmatter.name) {
    throw new DevskillError(
      `A skill ${frontmatter.name} deve estar em uma pasta com o mesmo nome; encontrada em ${directoryName}`,
      'SKILL_NAME_MISMATCH',
    );
  }

  const content = source.slice(match[0].length).trim();
  if (!content) {
    throw new DevskillError(
      `A skill ${frontmatter.name} não possui instruções após o frontmatter`,
      'EMPTY_SKILL',
    );
  }

  const heading = content.match(/^#\s+(.+?)(?:\s+#+)?\s*$/m)?.[1]?.trim();
  const title = frontmatter.title ?? heading ?? frontmatter.name;

  return {
    name: frontmatter.name,
    title,
    description: frontmatter.description,
    directory,
    skillFile,
    content,
    frontmatter,
  };
}
