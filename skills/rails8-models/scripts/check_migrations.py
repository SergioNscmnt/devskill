#!/usr/bin/env python3
"""Heurísticas somente leitura. Achados requerem revisão humana."""
from pathlib import Path
import sys,re
if len(sys.argv)!=2: sys.exit('Uso: check_migrations.py /projeto')
r=Path(sys.argv[1]).expanduser().resolve()
if not r.is_dir(): sys.exit('Diretório inexistente')
files=list((r/'db/migrate').glob('*.rb')) if (r/'db/migrate').is_dir() else []
rules=[(r'\b(?:t\.|add_column.*?)float\b','FLOAT: avaliar precisão para dinheiro'),(r'\b(?:t\.|add_column.*?)boolean\b','BOOLEAN: confirmar mapeamento/NULL/CHECK no banco'),(r'\b(?:t\.|add_column.*?)jsonb\b','JSONB: específico PostgreSQL'),(r'\b(?:t\.|add_column.*?)datetime\b','DATETIME: verificar timezone e tipo nativo')]
print('Verificando',len(files),'migrations')
for f in files:
 s=f.read_text(errors='replace')
 for pattern,desc in rules:
  if re.search(pattern,s): print(f'{f.name}: {desc}')
print('Heurístico; não executa migrations nem garante compatibilidade.')
