import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { renderMarkdownForTerminal } from '../src/utils/markdown-terminal.js';

describe('renderMarkdownForTerminal', () => {
  it('formata elementos Markdown sem códigos ANSI quando color está desabilitado', () => {
    const rendered = renderMarkdownForTerminal(
      '# Título\n\n* item **importante**\n* [Docs](https://example.com)\n\n```text\nvalor\n```',
      { color: false },
    );

    assert.match(rendered, /▌ Título/);
    assert.match(rendered, /• item importante/);
    assert.match(rendered, /Docs \(https:\/\/example.com\)/);
    assert.match(rendered, /╭─ text\n│  valor\n╰─/);
    assert.doesNotMatch(rendered, /\u001B\[/);
  });
});
