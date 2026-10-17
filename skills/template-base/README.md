# template-base

Skill para criar dashboards com navbar, sidebar, área principal e footer, preservando o texto e os componentes centrais da especificação original. Compatível com a estrutura Agent Skills usada por Codex e Claude Code.

## Instalar globalmente

```bash
mkdir -p ~/.codex/skills ~/.claude/skills
cp -r template-base ~/.codex/skills/
cp -r template-base ~/.claude/skills/
```

## Validar

```bash
python3 scripts/validate_skill.py
python3 scripts/check_dashboard.py assets/templates/dashboard-shell.html
```

O HTML de assets é um esqueleto demonstrativo, não uma UI final estilizada ou integrada. Referências são consultadas sob demanda para economizar tokens.
