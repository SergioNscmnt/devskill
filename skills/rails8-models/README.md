# rails8-models

Skill portátil Agent Skills para Rails 8, com tipagem e modelagem específica para PostgreSQL, MariaDB e Oracle.

## Instalação (global)
```bash
mkdir -p ~/.codex/skills ~/.claude/skills
cp -r rails8-models ~/.codex/skills/
cp -r rails8-models ~/.claude/skills/
```

Para `devskill-cli`, publicar **a pasta completa**, incluindo `SKILL.md`, `references`, `scripts` e `assets`.

## Uso
Peça: "Use rails8-models para criar models e migrations para o banco configurado, apresentando matriz de tipos, validações, constraints e testes."

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
