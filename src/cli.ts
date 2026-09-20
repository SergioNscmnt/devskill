#!/usr/bin/env node
import { resolve } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { Command } from 'commander';
import { registerSkillCommands } from './commands/skill/index.js';
import { DevskillError } from './errors/devskill-error.js';

export function createProgram(): Command {
  const program = new Command()
    .name('devskill')
    .description('Gerenciador de Agent Skills para Codex e Claude Code')
    .version('0.1.0')
    .showHelpAfterError();

  registerSkillCommands(program);
  return program;
}

export async function main(argv = process.argv): Promise<void> {
  await createProgram().parseAsync(argv);
}

const isEntryPoint =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isEntryPoint) {
  main().catch((error: unknown) => {
    if (error instanceof DevskillError) {
      process.stderr.write(`Erro: ${error.message}\n`);
      process.exitCode = 1;
      return;
    }

    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Erro inesperado: ${message}\n`);
    process.exitCode = 1;
  });
}
