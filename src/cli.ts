#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { registerConfigCommands } from './commands/config.js';
import { registerSetupCommand } from './commands/setup.js';
import {
  registerInstallCommand,
  registerSkillCommands,
  registerTopLevelSkillCommands,
} from './commands/skill/index.js';
import { DevskillError } from './errors/devskill-error.js';

export function createProgram(): Command {
  const program = new Command()
    .name('skill')
    .description('Gerenciador de Agent Skills para Codex e Claude Code')
    .version('0.2.0')
    .showHelpAfterError();

  registerSkillCommands(program);
  registerTopLevelSkillCommands(program);
  registerInstallCommand(program);
  registerConfigCommands(program);
  registerSetupCommand(program);
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
