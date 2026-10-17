#!/usr/bin/env python3
from pathlib import Path
import re,sys
root=Path(__file__).resolve().parents[1]
f=root/'SKILL.md'
errors=[]
if not f.is_file(): errors.append('SKILL.md ausente')
else:
 s=f.read_text(encoding='utf8')
 if not re.match(r'\A---\n(?s:.*?)\n---\n',s): errors.append('frontmatter inválido')
 for field in ('name','description'):
  if not re.search(rf'(?m)^{field}:\s*\S',s): errors.append(f'{field} ausente')
 for ref in re.findall(r'\]\((references/[^)]+|assets/[^)]+)\)',s):
  if not (root/ref).is_file(): errors.append(f'link quebrado: {ref}')
for d in ('references','scripts','assets'): 
 if not (root/d).is_dir(): errors.append(f'diretório {d} ausente')
if errors:
 print('\n'.join(errors));sys.exit(1)
print('OK: estrutura e referências')
