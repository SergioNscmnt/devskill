# Backend

Skill de desenvolvimento, revisão e refatoração de backend e APIs para Codex e Claude Code.

## Instalação pelo CLI

```bash
npm install --global @jsndev/devskill
devskill-cli install backend
```

O CLI consulta o catálogo no GitHub e instala a skill para os dois agentes. Use `--host codex` ou `--host claude` para escolher apenas um. Inicie uma nova sessão do agente após instalar.

## Uso

Invoque `$devskill-backend` no Codex ou `/devskill_backend` no Claude Code.

## Conteúdo
- `SKILL.md`: orientações principais, objetivo, fluxo e critérios de aceite.
- `references/`: arquitetura, segurança, testes, APIs/dados e revisão.
- `scripts/`: utilitários Python 3.9+ sem dependências externas, por padrão somente leitura.
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

`check-secrets.py` retorna código 2 se encontrar padrões suspeitos; não exibe o valor detectado. Pode haver falsos positivos e falsos negativos. Não substitui auditoria dedicada.
