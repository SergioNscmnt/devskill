#!/usr/bin/env python3
"""Validate a portable Agent Skill with no third-party dependencies."""
import argparse
import pathlib
import re
import sys


def validate(root: pathlib.Path) -> list[str]:
    errors = []
    source = root / 'SKILL.md'
    if not source.is_file():
        return ['SKILL.md ausente']
    data = source.read_text(encoding='utf-8-sig')
    match = re.match(r'\A---\s*\n(.*?)\n---\s*\n', data, re.S)
    if not match:
        return ['Frontmatter YAML ausente ou mal delimitado']
    front = match.group(1)
    name = re.search(r'^name:\s*(.*?)\s*$', front, re.M)
    if not name or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', name.group(1)) or len(name.group(1)) > 64:
        errors.append('name invalido (1-64 caracteres minusculos, numeros e hifens)')
    elif name.group(1) != root.name:
        errors.append('name deve corresponder ao nome do diretorio')
    desc = re.search(r'^description:\s*(.*?)(?=^[A-Za-z][\w-]*:|\Z)', front, re.M | re.S)
    if not desc:
        errors.append('description ausente')
    else:
        value = re.sub(r'\s+', ' ', desc.group(1).strip())
        if value.startswith(('>-', '>', '|-', '|')):
            value = value.lstrip('>|-').strip()
        if not value or len(value) > 1024:
            errors.append('description vazia ou maior que 1024 caracteres')
    for link in re.findall(r'\]\(([^)#]+)(?:#[^)]+)?\)', data):
        if '://' in link or link.startswith('#'):
            continue
        target = (root / link).resolve()
        if not target.is_relative_to(root.resolve()) or not target.exists():
            errors.append(f'referencia nao encontrada/insegura: {link}')
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', nargs='?', default=str(pathlib.Path(__file__).resolve().parents[1]))
    args = parser.parse_args()
    root = pathlib.Path(args.root).expanduser().resolve()
    errors = validate(root)
    for error in errors:
        print(f'ERRO: {error}', file=sys.stderr)
    if errors:
        return 1
    print(f'OK: {root.name} possui estrutura e referencias validas')
    return 0


if __name__ == '__main__':
    sys.exit(main())
