#!/usr/bin/env python3
"""Read-only heuristic scan for likely inline credentials. Exit 2 on findings."""
import argparse
import re
import subprocess
from pathlib import Path

PATTERNS = [
    re.compile(r'(?i)\b(?:password|passwd|db_password|secret_access_key|api[_-]?key|client_secret)\b\s*[:=]\s*[\'\"]?([a-z0-9_!@#$%^&*+=./-]{8,})'),
    re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
]
IGNORE_SUFFIXES = ('.lock', '.min.js', '.map', '.svg', '.png', '.jpg', '.jpeg', '.pdf', '.zip')
IGNORE_DIRS = {'.git', 'node_modules', 'vendor', 'dist', 'build', '.venv'}
MAX_BYTES = 512_000


def files_to_scan(root):
    result = subprocess.run(['git', '-C', str(root), 'ls-files', '-z'], capture_output=True, check=False)
    if result.returncode == 0:
        for raw in result.stdout.split(b'\0'):
            if raw:
                yield root / raw.decode('utf-8', 'surrogateescape')
    else:
        for path in root.rglob('*'):
            if path.is_file() and not any(part in IGNORE_DIRS for part in path.relative_to(root).parts):
                yield path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', nargs='?', default='.')
    args = parser.parse_args()
    root = Path(args.directory).expanduser().resolve()
    if not root.is_dir():
        parser.error('Diretorio inexistente')
    count = 0
    for path in files_to_scan(root):
        if not path.is_file() or path.suffix.lower() in IGNORE_SUFFIXES or path.stat().st_size > MAX_BYTES:
            continue
        try:
            lines = path.read_text(encoding='utf-8').splitlines()
        except (UnicodeError, OSError):
            continue
        for num, line in enumerate(lines, 1):
            if any(p.search(line) for p in PATTERNS):
                print(f'POSSIVEL SEGREDO: {path.relative_to(root)}:{num} (valor oculto)')
                count += 1
    print(f'Conclusao: {count} ocorrencia(s) heuristica(s); revisar manualmente. Nao substitui scanner dedicado.')
    return 2 if count else 0


if __name__ == '__main__':
    raise SystemExit(main())
