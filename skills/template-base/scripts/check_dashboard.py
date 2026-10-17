#!/usr/bin/env python3
"""Checagem HEURÍSTICA de HTML estático, não avalia acessibilidade real nem JS."""
from html.parser import HTMLParser
from pathlib import Path
import sys

class Inspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.found = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        key = (tag, attrs.get('data-component'))
        self.found.add(key)

expected = {'navbar': 'header', 'sidebar': 'aside', 'menu-list': 'nav', 'app-content': 'main', 'footer': 'footer', 'user-info': None}
if len(sys.argv) != 2:
    sys.exit('Uso: python3 check_dashboard.py arquivo.html')
p = Path(sys.argv[1])
if not p.is_file():
    sys.exit('Arquivo não encontrado')
parser = Inspector()
parser.feed(p.read_text(encoding='utf-8'))
missing = [f'{component} (tag: {tag or "qualquer"})' for component, tag in expected.items() if not any(comp == component and (tag is None or t == tag) for t, comp in parser.found)]
if missing:
    print('Ausências estruturais:', ', '.join(missing))
    sys.exit(1)
print('OK: hooks e landmarks básicos detectados; validar comportamento no browser')
