# devskill

CLI para gerenciar uma única coleção de [Agent Skills](https://agentskills.io) e disponibilizá-la no Codex e no Claude Code.

Cada skill fica em `skills/<nome>/SKILL.md`. O frontmatter obrigatório é:

```markdown
---
name: code-review
description: Reviews code changes. Use when the user requests a code review.
---

Instructions for the agent.
```

## Desenvolvimento

Requer Node.js 20 ou superior.

```bash
npm install
npm run build
npm test
```

Durante o desenvolvimento:

```bash
npm run dev -- skill list
```

## Comandos

```bash
devskill skill list
devskill skill list --status
devskill skill show code-review
devskill skill show code-review --raw
devskill skill validate

devskill skill install code-review
devskill skill install all
devskill skill install --all

devskill skill update code-review
devskill skill update all

devskill skill remove code-review
devskill skill remove all --yes

# Instale a skill antes da primeira execução.
devskill skill run code-review --agent codex
devskill skill run code-review --agent claude -- "review the current diff"
```

Por padrão, instalação, atualização e remoção atingem Codex e Claude no escopo do projeto:

- Codex: `.agents/skills/<nome>`
- Claude Code: `.claude/skills/<nome>`

Use `--target codex`, `--target claude` ou `--target all`. Para skills pessoais, use `--scope user`.

As instalações são links simbólicos para o catálogo. O CLI se recusa a substituir pastas ou links que não administra.

Use `--source <diretório>` ou a variável `DEVSKILL_SKILLS_DIR` para selecionar outro catálogo.
# devskill
