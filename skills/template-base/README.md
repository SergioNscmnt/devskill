# Template Base

Skill para criar dashboards e formulários da aplicação com navbar, sidebar, área principal e footer, preservando os padrões visuais e componentes existentes. Compatível com a estrutura Agent Skills usada por Codex e Claude Code.

## Instalação pelo CLI

```bash
npm install --global @jsndev/devskill
devskill-cli install template-base
```

O CLI consulta o catálogo no GitHub e instala a skill para os dois agentes. Use `--host codex` ou `--host claude` para escolher apenas um. Inicie uma nova sessão do agente após instalar.

## Uso

Invoque `$devskill-template-base` no Codex ou `/devskill_template-base` no Claude Code.

## Validar

```bash
python3 scripts/validate_skill.py
python3 scripts/check_dashboard.py assets/templates/dashboard-shell.html
python3 scripts/check_dashboard.py assets/templates/form-shell.html
python3 scripts/check_form.py assets/templates/form-shell.html
```

O HTML de assets é um esqueleto demonstrativo, não uma UI final estilizada ou integrada. Referências são consultadas sob demanda para economizar tokens.
