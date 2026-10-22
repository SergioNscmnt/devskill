# Rails 8 Models

Skill portátil Agent Skills para Rails 8, com tipagem e modelagem específica para PostgreSQL, MariaDB e Oracle.

## Instalação pelo CLI

```bash
npm install --global @jsndev/devskill
devskill-cli install rails8-models
```

O CLI consulta o catálogo no GitHub e instala a skill com seus arquivos auxiliares para os dois agentes. Use `--host codex` ou `--host claude` para escolher apenas um. Inicie uma nova sessão do agente após instalar.

## Uso
Invoque `$devskill-rails8-models` no Codex ou `/devskill_rails8-models` no Claude Code. Por exemplo: "Use esta skill para criar models e migrations para o banco configurado, apresentando matriz de tipos, validações, constraints e testes."

## Scripts
```bash
python3 scripts/validate_skill.py
python3 scripts/inspect_database.py /caminho/do/projeto
python3 scripts/check_migrations.py /caminho/do/projeto
```

Inspeção estática não conecta ao banco, nem confirma funcionamento real dos adapters. Testes de migração devem ocorrer em banco descartável do mesmo tipo/versão do alvo.

## Fontes
- https://guides.rubyonrails.org/active_record_migrations.html
- https://guides.rubyonrails.org/active_record_postgresql.html
- https://guides.rubyonrails.org/active_record_validations.html
- https://mariadb.com/kb/en/data-types/
- https://docs.oracle.com/en/database/
- https://github.com/rsim/oracle-enhanced
