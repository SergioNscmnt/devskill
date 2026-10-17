#!/usr/bin/env python3
"""Inventário estático: não imprime conteúdo de credenciais."""
from pathlib import Path
import sys

if len(sys.argv) != 2:
    sys.exit("Uso: python3 inspect_rails.py /caminho/projeto")
root = Path(sys.argv[1]).expanduser().resolve()
if not root.is_dir():
    sys.exit("ERRO: diretório inexistente")
patterns = [
    "Gemfile", "Gemfile.lock", ".ruby-version", "config/application.rb",
    "config/database.yml", "config/cache.yml", "config/queue.yml",
    "config/cable.yml", "config/importmap.rb", "package.json",
    "app/javascript/controllers", "app/jobs", "app/models",
    "app/controllers", "app/helpers", "app/services",
    "test", "spec", "bin/rails", "bin/jobs"
]
print(f"Projeto: {root}")
for p in patterns:
    path = root / p
    print(f"{'SIM' if path.exists() else 'NÃO'} {p}")
# Não ler Gemfile.lock ou configs automaticamente (podem conter endpoints privados).
print("Nota: presença de arquivo não comprova versão nem configuração ativa.")
