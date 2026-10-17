#!/usr/bin/env python3
"""Read-only inventory of probable backend ecosystems and test locations."""
import argparse
from pathlib import Path

MARKERS = {
    'Ruby/Rails': ('Gemfile', 'config/application.rb'),
    'Node/TypeScript': ('package.json', 'tsconfig.json'),
    'Python': ('pyproject.toml', 'requirements.txt', 'manage.py'),
    '.NET': ('global.json',),
    'Java': ('pom.xml', 'build.gradle', 'build.gradle.kts'),
    'Go': ('go.mod',),
    'PHP': ('composer.json',),
}
TEST_DIRS = ('test', 'tests', 'spec', '__tests__')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', nargs='?', default='.')
    args = parser.parse_args()
    root = Path(args.directory).expanduser().resolve()
    if not root.is_dir():
        parser.error('Diretorio inexistente')
    print(f'Projeto: {root}')
    for ecosystem, markers in MARKERS.items():
        found = [m for m in markers if (root / m).is_file()]
        if found:
            print(f'Stack possivel: {ecosystem} ({", ".join(found)})')
    print('Testes: ' + (', '.join(d for d in TEST_DIRS if (root / d).is_dir()) or 'nao detectados na raiz'))
    print('Somente leitura: nenhuma alteracao realizada.')


if __name__ == '__main__':
    main()
