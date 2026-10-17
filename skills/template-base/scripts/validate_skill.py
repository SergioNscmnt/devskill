#!/usr/bin/env python3
"""Valida metadados e links relativos da skill sem dependências externas."""
from pathlib import Path
import re
import sys
root = Path(__file__).resolve().parents[1]
content = (root / 'SKILL.md').read_text(encoding='utf-8')
errors = []
match = re.match(r'\A---\n(.*?)\n---\n', content, re.S)
if not match:
    errors.append('Frontmatter YAML ausente')
else:
    metadata = match.group(1)
    if not re.search(r'^name:\s*template-base\s*$', metadata, re.M):
        errors.append('name deve ser template-base')
    if not re.search(r'^description:\s*\S+', metadata, re.M):
        errors.append('description ausente')
for ref in re.findall(r'\]\(((?:references|scripts|assets)/[^)]+)\)', content):
    if not (root / ref).is_file():
        errors.append(f'Arquivo ausente: {ref}')
for folder in ('references', 'scripts', 'assets/templates'):
    if not (root / folder).is_dir():
        errors.append(f'Diretório ausente: {folder}')
for error in errors:
    print('ERRO:', error, file=sys.stderr)
print('OK: estrutura da skill válida' if not errors else 'Skill inválida')
sys.exit(bool(errors))
