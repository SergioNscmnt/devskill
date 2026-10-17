# devskill-rails8

Skill portátil no formato Agent Skills para orientar Codex e Claude Code no desenvolvimento Ruby on Rails 8 (MVC, Active Record, Hotwire, Solid Cache/Queue, segurança e testes).

## Instalação global
```bash
mkdir -p ~/.codex/skills ~/.claude/skills
cp -r devskill-rails8 ~/.codex/skills/
cp -r devskill-rails8 ~/.claude/skills/
```
Caminhos e mecanismos de descoberta podem variar conforme versões/configuração dos agentes. Verifique documentação do agente instalado.

## Comandos
```bash
python3 scripts/validate_skill.py
python3 scripts/inspect_rails.py /caminho/projeto
bash scripts/audit_rails.sh /caminho/projeto
```
Scripts não instalam dependências ou alteram arquivos deliberadamente. O script de auditoria pode buscar atualizações de advisories na rede, se o comando `bundler-audit` disponível aceitar `--update`.

## Uso
Peça: "Revise esta implementação Rails 8 conforme a devskill-rails8 e corrija falhas de segurança, N+1 e problemas de Active Record."

Não substitui revisão humana, testes de integração ou avaliação de segurança atualizada.
