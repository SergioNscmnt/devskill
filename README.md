# DevSkill CLI

Gerenciador de Agent Skills para Codex e Claude Code. O catálogo é consultado em [skills no GitHub](https://github.com/SergioNscmnt/devskill/tree/main/skills). As skills baixadas ficam em cache local; somente as escolhidas são copiadas para os diretórios globais dos agentes. Nenhum arquivo é criado nos projetos de trabalho.

## Instalação

```bash
npm install --global @jsndev/devskill
devskill-cli init
```

`init` prepara os diretórios pessoais reconhecidos pelos agentes e não instala skills. No WSL, o CLI usa o HOME Linux da sessão.

## Comandos

```text
devskill-cli init
devskill-cli list
devskill-cli list update
devskill-cli install backend
devskill-cli install all
devskill-cli install all --sync
devskill-cli remove backend
devskill-cli remove all
devskill-cli update
```

`list` consulta somente os nomes das skills no GitHub, mostra `(new)` para as que ainda não estão no cache e verifica os diretórios reais dos agentes. A consulta requer acesso ao GitHub. `list update` baixa ou atualiza as skills e seus arquivos auxiliares no cache. `install <nome>` consulta o GitHub e atualiza o cache antes de instalar. O argumento `all` também vale para `remove`. `--host codex|claude|all` seleciona agentes.

As invocações instaladas são `$devskill-backend` no Codex e `/devskill_backend` no Claude Code. Inicie uma nova sessão do agente após instalar ou sincronizar para atualizar a descoberta.

`install` é idempotente e não substitui pastas existentes. As cópias instaladas carregam um manifesto de propriedade e hashes. `remove` apaga somente arquivos gerenciados que continuam inalterados; arquivos modificados ou adicionados são preservados. `--sync` atualiza uma instalação gerenciada apenas após confirmar que seus arquivos continuam intactos.

`update` compara a versão instalada com a tag `latest` do npm e atualiza o pacote global. Novas skills não exigem atualização do pacote: use `list update` para atualizar o catálogo. Skills já instaladas não são sincronizadas automaticamente; use `devskill-cli install all --sync` quando quiser fazê-lo.

O caminho padrão é `~/.agents/skills` para Codex e `~/.claude/skills` para Claude Code. `CLAUDE_CONFIG_DIR` permite alterar a raiz pessoal do Claude. Também são aceitos `DEVSKILL_CODEX_SKILLS_DIR` e `DEVSKILL_CLAUDE_SKILLS_DIR` para definir diretamente os diretórios de skills.

## Catálogo e desenvolvimento

Cada pasta imediata em `skills/` contendo `SKILL.md` é publicada no catálogo do GitHub. O manifesto precisa ter frontmatter YAML com `name` e `description` e instruções no corpo. Recursos auxiliares são baixados com a skill. O cache fica em `$XDG_CACHE_HOME/devskill/skills` (ou `~/.cache/devskill/skills`). Os comandos globais consultam somente o GitHub; `--source`, `DEVSKILL_SKILLS_DIR` e a configuração `skills-dir` continuam disponíveis apenas nos comandos legados.

```bash
npm install
npm run build
npm test
npm pack --dry-run
```

O executável `skill` e o alias `devskill` permanecem disponíveis para compatibilidade. Os comandos legados de catálogo estão agrupados em `devskill-cli legacy`.

## Publicação

O pacote mantém `@jsndev/devskill` e publicação npm pública. Para publicar manualmente uma versão preparada:

```bash
npm run build
npm test
npm pack --dry-run
npm publish --access public
```

O CLI não publica pacotes.
