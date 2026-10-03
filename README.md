# devskill

CLI para gerenciar um catálogo local de [Agent Skills](https://agentskills.io)
e disponibilizá-las no Codex e no Claude Code.

## Instalação e inicialização

Instale o pacote globalmente para ter o comando `skill` disponível:

```bash
npm install --global @jsndev/devskill
```

Dentro do projeto, configure a integração nos dois agentes:

```bash
skill init
```

O comando cria links para a skill roteadora em `.agents/skills` e
`.claude/skills` no projeto atual. Depois, instale no projeto as skills que
quiser disponibilizar no chat:

```bash
skill list
skill install backend
skill install all
```

As skills instaladas podem ser chamadas diretamente no chat do agente, por
exemplo `$backend` no Codex ou `/backend` no Claude Code. Também é possível
invocar um fluxo do catálogo pelo roteador `$devskill backend` no Codex ou
`/devskill backend` no Claude Code.

## Comandos

```bash
skill init
skill list
skill list --status
skill install backend
skill install all
skill update backend
skill update all
skill delete backend
skill delete all --yes
skill show backend
skill validate
```

`delete all` pede confirmação. `--target codex`, `--target claude` e
`--target all` escolhem os agentes; o padrão é `all`. `--scope user` instala,
atualiza, lista ou remove skills no escopo do usuário em vez do projeto.

O comando `devskill` continua disponível como alias do executável `skill`.

## Catálogo

O pacote inclui skills padrão em `skills/<nome>/SKILL.md`. O frontmatter
obrigatório é:

```markdown
---
name: code-review
description: Reviews code changes. Use when the user requests a code review.
---

Instructions for the agent.
```

Para usar um catálogo personalizado:

```bash
skill config set skills-dir ~/Projetos/minhas-skills
```

Também é possível passar `--source <diretório>` em comandos de catálogo ou
definir `DEVSKILL_SKILLS_DIR` para uma substituição temporária.

## Desenvolvimento

Requer Node.js 20 ou superior.

```bash
npm install
npm run build
npm test
```
