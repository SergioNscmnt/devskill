import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { createProgram } from '../src/cli.js';

test('CLI mostra a versão declarada no pacote', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')) as { version: string };
  assert.equal(createProgram().version(), manifest.version);
});
