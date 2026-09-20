import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { claudeAdapter } from '../src/hosts/claude.adapter.js';
import { codexAdapter } from '../src/hosts/codex.adapter.js';

describe('host adapters', () => {
  it('gera a menção nativa de cada host', () => {
    assert.equal(codexAdapter.invocation('review', ['current', 'diff']),
      '$review current diff',
    );
    assert.equal(claudeAdapter.invocation('review', ['current', 'diff']),
      '/review current diff',
    );
  });
});
