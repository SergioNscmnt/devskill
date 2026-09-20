import { z } from 'zod';

const skillNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const skillFrontmatterSchema = z
  .object({
    name: z
      .string()
      .min(1, 'name é obrigatório')
      .max(64, 'name deve ter no máximo 64 caracteres')
      .regex(
        skillNamePattern,
        'name deve conter apenas letras minúsculas, números e hífens',
      ),
    description: z
      .string()
      .trim()
      .min(1, 'description é obrigatória')
      .max(1024, 'description deve ter no máximo 1024 caracteres'),
    title: z
      .string()
      .trim()
      .min(1, 'title não pode ser vazio')
      .max(120, 'title deve ter no máximo 120 caracteres')
      .optional(),
  })
  .passthrough();

export type SkillFrontmatter = z.output<typeof skillFrontmatterSchema>;
