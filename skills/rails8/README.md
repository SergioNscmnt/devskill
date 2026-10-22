# Rails 8

Skill portátil no formato Agent Skills para orientar Codex e Claude Code no desenvolvimento Ruby on Rails 8 (MVC, Active Record, Hotwire, Solid Cache/Queue, segurança e testes).

## Instalação pelo CLI

```bash
npm install --global @jsndev/devskill
devskill-cli install rails8
```

O CLI consulta o catálogo no GitHub e instala a skill para os dois agentes. Use `--host codex` ou `--host claude` para escolher apenas um. Inicie uma nova sessão do agente após instalar.

## Comandos
```bash
python3 scripts/validate_skill.py
python3 scripts/inspect_rails.py /caminho/projeto
bash scripts/audit_rails.sh /caminho/projeto
```
Scripts não instalam dependências ou alteram arquivos deliberadamente. O script de auditoria pode buscar atualizações de advisories na rede, se o comando `bundler-audit` disponível aceitar `--update`.

## Uso
Invoque `$devskill-rails8` no Codex ou `/devskill_rails8` no Claude Code. Por exemplo: "Revise esta implementação Rails 8 e corrija falhas de segurança, N+1 e problemas de Active Record."

Não substitui revisão humana, testes de integração ou avaliação de segurança atualizada.
