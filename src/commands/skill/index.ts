import { Command } from 'commander';
import { registerListCommand } from './list.js';
import { registerManageCommand } from './manage.js';
import { registerRunCommand } from './run.js';
import { registerShowCommand } from './show.js';
import { registerValidateCommand } from './validate.js';

export function registerSkillCommands(program: Command): void {
  const skill = program
    .command('skill')
    .description('Gerencia skills portáteis para Codex e Claude Code');

  registerListCommand(skill);
  registerShowCommand(skill);
  registerValidateCommand(skill);
  registerManageCommand(skill, 'install');
  registerManageCommand(skill, 'update');
  registerManageCommand(skill, 'remove');
  registerRunCommand(skill);
}

export function registerInstallCommand(program: Command): void {
  registerManageCommand(program, 'install');
}

export function registerTopLevelSkillCommands(program: Command): void {
  registerListCommand(program);
  registerShowCommand(program);
  registerValidateCommand(program);
  registerManageCommand(program, 'update');
  registerManageCommand(program, 'remove');
  registerRunCommand(program);
}
