#!/usr/bin/env node
import { readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { registerConfigCommands } from './commands/config.js';
import { registerGlobalCommands } from './commands/global.js';
import { registerSkillCommands } from './commands/skill/index.js';
import { DevskillError } from './errors/devskill-error.js';

const packageVersion = (JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string }).version;

export function createProgram(): Command {
  const program = new Command()
    .name('devskill-cli')
    .description('Gerenciador de Agent Skills para Codex e Claude Code')
    .version(packageVersion)
    .showHelpAfterError();

  registerGlobalCommands(program);
  const legacy = program.command('legacy').description('Comandos legados de gerenciamento por projeto');
  registerSkillCommands(legacy);
  registerConfigCommands(program);
  return program;
}

export async function main(argv = process.argv): Promise<void> {
  await createProgram().parseAsync(argv);
}

const isEntryPoint =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === realpathSync(resolve(process.argv[1]));

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
