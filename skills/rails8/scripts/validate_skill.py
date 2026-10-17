#!/usr/bin/env python3
"""Validação estática simples de estrutura Agent Skills, sem dependências."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
skill = ROOT / "SKILL.md"
errors = []
if not skill.exists():
    errors.append("SKILL.md ausente")
else:
    content = skill.read_text(encoding="utf-8")
    match = re.match(r"\A---\s*\n(.*?)\n---\s*\n", content, flags=re.S)
    if not match:
        errors.append("YAML frontmatter delimitado por --- ausente")
    else:
        fm = match.group(1)
        for key in ("name", "description"):
            if not re.search(rf"(?m)^{key}:\s*\S", fm):
                errors.append(f"campo {key} ausente/vazio")
        nm = re.search(r"(?m)^name:\s*[\"']?([a-z0-9-]+)", fm)
        if nm and nm.group(1) != ROOT.name:
            errors.append("name diferente do nome da pasta")
    for link in re.findall(r"\]\((references/[^)#]+|assets/[^)#]+)\)", content):
        if not (ROOT / link).is_file():
            errors.append(f"referência inexistente: {link}")
for required in ("references", "scripts", "assets"):
    if not (ROOT / required).is_dir():
        errors.append(f"diretório ausente: {required}")
if errors:
    for error in errors:
        print(f"ERRO: {error}", file=sys.stderr)
    sys.exit(1)
print("OK: estrutura e referências locais válidas")
