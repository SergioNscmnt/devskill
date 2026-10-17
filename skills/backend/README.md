# backend

Skill portavel para Codex e Claude Code, baseada no padrao Agent Skills.

## Conteudo
- `SKILL.md`: orientacoes principais, objetivo, fluxo e criterios de aceite.
- `references/`: arquitetura, seguranca, testes, APIs/dados e revisao.
- `scripts/`: utilitarios Python 3.9+ sem dependencias externas, por padrao somente leitura.
- `assets/templates/`: plano, checklist e resumo de entrega.

## Validar a skill

```bash
python3 scripts/validate-skill.py
```

## Inspecionar um projeto (somente leitura)

```bash
python3 scripts/inspect-backend.py /caminho/projeto
python3 scripts/check-secrets.py /caminho/projeto
```

`check-secrets.py` retorna codigo 2 se encontrar padroes suspeitos; nao exibe o valor detectado. Pode haver falsos positivos e falsos negativos. Nao substitui auditoria dedicada.

## Instalar globalmente
Copie toda a pasta para `~/.codex/skills/backend/` e/ou `~/.claude/skills/backend/`.
Para instalar a partir de uma fonte unica no Linux/WSL, tambem e possivel criar links simbolicos nos caminhos esperados pelos agentes.

A ativacao automatica depende de o agente descobrir a skill e julga-la relevante ao pedido.
