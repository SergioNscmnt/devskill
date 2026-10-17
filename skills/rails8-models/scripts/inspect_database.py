#!/usr/bin/env python3
"""Inspeção estática e segura. Não lê database.yml, ENV ou credenciais."""
from pathlib import Path
import sys,re
if len(sys.argv)!=2: sys.exit('Uso: inspect_database.py /projeto')
r=Path(sys.argv[1]).expanduser().resolve()
if not r.is_dir(): sys.exit('Diretório inexistente')
print(f'Projeto: {r}')
for name in ('Gemfile','Gemfile.lock','config/database.yml','db/schema.rb','db/structure.sql','app/models','db/migrate'):
 print(('OK' if (r/name).exists() else '--'), name)
lock=r/'Gemfile.lock'
if lock.is_file():
 content=lock.read_text(errors='replace')
 for gem in ('rails','activerecord','pg','mysql2','trilogy','activerecord-oracle_enhanced-adapter'):
  m=re.search(r'^    '+re.escape(gem)+r' \(([^)]+)\)',content,re.M)
  if m: print(f'{gem}: {m.group(1)}')
print('Banco e versão do servidor exigem confirmação pela conexão correta; database.yml não foi lido.')
