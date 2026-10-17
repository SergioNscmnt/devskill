---
name: rails8-models
description: >
  Cria e revisa models, associações, validações, migrations, índices e constraints
  no Ruby on Rails 8 para PostgreSQL, MariaDB e Oracle. Use ao modelar tabelas,
  converter tipos de colunas, criar relacionamentos, migrar schemas ou corrigir
  integridade e compatibilidade entre adaptadores Active Record.
---

# Rails 8 — Modelagem e tipagem por banco

## Objetivo
Produzir modelagem consistente, íntegra, segura e adequada às versões reais do Rails, banco e adapter, com tipos nativos e comportamento verificados. Priorizar Active Record idiomático, sem confundir validação de model com constraint de banco.

## Antes de implementar
1. Detectar `Gemfile.lock`, versão de `ActiveRecord`, `config/database.yml`, `DATABASE_URL` somente pelo nome da variável (nunca imprimir segredos), migrations e schema existente. Determinar banco/versão **para a conexão relevante**, inclusive configurações múltiplas.
2. Determinar adapter (`postgresql`, `mysql2`, `trilogy`, `oracle_enhanced`) e compatibilidade com Rails 8; não presumir suporte da gem Oracle, consultar versão real.
3. Ler regras do domínio: limites, precisão/escala, nullability, unicidade, relacionamentos, identificadores, fuso horário, volumes de dados, dados antigos e SLA de deploy.
4. Carregar apenas a referência apropriada: `postgresql.md`, `mariadb.md` ou `oracle.md`, mais `shared-modeling.md`; consultar outras sob demanda.

## Regras obrigatórias
- **Sem mapeamento cego:** tipos genéricos de Rails são ponto de partida; verificar DDL gerado pelo adapter/servidor. Nunca presumir que `boolean`, `json`, `datetime` ou `bigint` são idênticos nos três bancos.
- **Integridade em duas camadas:** `validates` para experiência/erros; `NOT NULL`, FKs, UNIQUE e CHECK para invariantes críticas. Unique validation não resolve corrida.
- **Dinheiro e cálculos exatos:** `decimal` com `precision`/`scale` e Ruby `BigDecimal`; evitar `float`.
- **IDs externos e documentos:** CPF, CNPJ, CEP, telefone e códigos com zeros à esquerda são `string`, não inteiros.
- **Datas:** `date` para dia civil; `datetime` e política de UTC para instantes; distinguir `timestamp with time zone` de campos sem fuso e particularidades Oracle.
- **Chaves:** comparar PK e FK em tamanho e tipo nativos; nunca misturar UUID, `BIGINT` e `NUMBER` sem conversão planejada.
- **Associe corretamente:** `belongs_to`, `has_many`, `has_one` com `dependent`, `inverse_of`, `optional` e `foreign_key` somente quando justificados. FKs reais sempre que possível.
- **Validações:** campos obrigatórios, intervalos, comprimento, formato, enum e regras condicionais consistentes com schema. Não exigir `presence` em booleano `false`; usar `inclusion: { in: [true, false] }` se obrigatório.
- **Migrations seguras:** nunca aplicar DDL em produção sem aprovação; planejar backfill, locks, índices e rollback; preservar dados existentes. Em Oracle, DDL costuma realizar commit implícito.
- **SQL seguro:** bind params para valores, allowlist para identificadores e ordenações; evitar tipos específicos em migrations destinadas a múltiplos bancos sem branches explícitos.
- **Sem suposições de suporte:** funções e sintaxes devem ser testadas contra adapter e versões reais; registrar incompatibilidades e decisões.
- **Testes:** model tests, validações negativas, índices/FKs, constraints, concorrência quando relevante e round-trip de tipos/precisão em cada banco alvo.

## Fluxo
1. Inventariar stack/banco e model relacionado.
2. Produzir matriz `campo → semântica → Rails → tipo nativo esperado → null/default → constraints/índices`.
3. Implementar model e migration mínima; separar variantes por adapter quando necessário.
4. Conferir schema/DDL no banco de teste real, inclusive precisão e defaults.
5. Rodar testes direcionados; relatar quais bancos foram efetivamente verificados.
6. Entregar arquivos, matriz de conversões, riscos, comandos executados e pendências.

## Critérios de aceite
- Tipos corretos para semântica e banco ativo; sem perda silenciosa de precisão/zeros/fuso.
- Models com associações e validações coerentes com constraints do banco.
- PK/FK e índices validados; migração preserva dados e possui plano de rollback.
- Testes e verificações reais reportados sem alegar compatibilidade não testada.

## Referências sob demanda
- [Regras comuns e matriz de tipos](references/shared-modeling.md)
- [PostgreSQL](references/postgresql.md)
- [MariaDB](references/mariadb.md)
- [Oracle](references/oracle.md)
- [Validações e associações](references/models-validations.md)
- [Migrations, testes e rollout](references/migrations-testing.md)

## Scripts
- `python3 scripts/validate_skill.py` — confere pacote e referências.
- `python3 scripts/inspect_database.py /projeto` — inspeção estática, sem conexão e sem exposição de segredos.
- `python3 scripts/check_migrations.py /projeto` — alertas heurísticos não substituem execução no SGBD.

## Templates
- [Matriz de campos](assets/templates/field-mapping.md)
- [Checklist de revisão](assets/templates/review-checklist.md)
- [Plano de migração](assets/templates/migration-plan.md)
