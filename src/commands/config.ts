import { Command } from 'commander';
import { bundledSkillsDirectory } from '../core/bundled-skill.js';
import {
  defaultConfigPath,
  loadConfig,
  saveDefaultAgent,
  saveSkillsDirectory,
} from '../core/config-loader.js';
import { DevskillError } from '../errors/devskill-error.js';

export function registerConfigCommands(program: Command): void {
  const config = program
    .command('config')
    .description('Configura o catálogo local de skills');

  config
    .command('set <key> <value>')
    .description('Define uma configuração')
    .action(async (key: string, value: string) => {
      if (key === 'skills-dir') {
        const directory = await saveSkillsDirectory(value);
        process.stdout.write(`Catálogo local configurado: ${directory}\n`);
        return;
      }

      if (key === 'default-agent') {
        if (value !== 'codex' && value !== 'claude') {
          throw new DevskillError(
            'Agente inválido. Use codex ou claude.',
            'INVALID_CONFIG_VALUE',
          );
        }
        await saveDefaultAgent(value);
        process.stdout.write(`Agente padrão configurado: ${value}\n`);
        return;
      }

      {
        throw new DevskillError(
          'Configuração desconhecida. Use skills-dir ou default-agent.',
          'UNKNOWN_CONFIG_KEY',
        );
      }
    });

  config
    .command('get [key]')
    .description('Exibe uma configuração')
    .action(async (key?: string) => {
      if (key !== undefined && key !== 'skills-dir' && key !== 'default-agent') {
        throw new DevskillError(
          'Configuração desconhecida. Use skills-dir ou default-agent.',
          'UNKNOWN_CONFIG_KEY',
        );
      }

      const current = await loadConfig();
      if (key === 'default-agent') {
        process.stdout.write(`${current.defaultAgent ?? 'não configurado'}\n`);
        return;
      }

      if (!current.skillsDir) {
        const bundledDirectory = bundledSkillsDirectory();
        if (key === 'skills-dir') {
          process.stdout.write(`${bundledDirectory}\n`);
          return;
        }

        process.stdout.write(
          `skills-dir: ${bundledDirectory} (catálogo empacotado)\ndefault-agent: ${current.defaultAgent ?? 'não configurado'}\nConfiguração: ${defaultConfigPath()}\n`,
        );
        return;
      }

      if (key === 'skills-dir') {
        process.stdout.write(`${current.skillsDir}\n`);
        return;
      }

      process.stdout.write(
        `skills-dir: ${current.skillsDir}\ndefault-agent: ${current.defaultAgent ?? 'não configurado'}\n`,
      );
    });
}
