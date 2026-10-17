# Migrations, rollout e testes cross-database

## Fluxo recomendado
1. Auditar tabelas/constraints/índices existentes no ambiente correto.
2. Planejar migration expand/backfill/contract para dados antigos; testar reversão e duração.
3. Para alterações de tipos, detectar truncamento, arredondamento, perda de zeros à esquerda, timezone, collation e locks.
4. Usar migration version exatamente conforme Active Record do projeto (`ActiveRecord::Migration[8.0]`, `[8.1]`, etc.).
5. Validar DDL e dados em banco descartável da **mesma família/versão** do alvo.
6. Confirmar índice UNIQUE/FK/check diretamente no catálogo; testes de model por si só não bastam.
7. Registrar quando algum banco não foi testado; nunca alegar portabilidade automática.

## Testes mínimos
- Campos com `NULL`, string vazia, valores-limite e valores fora de alcance.
- `BigDecimal` armazenado/lido sem perda; escala máxima.
- Boolean `true/false/nil` e `CHECK` no banco (especial atenção a Oracle/MariaDB).
- JSON: serialização/consulta e falha para JSON inválido, se relevante.
- FK ausente, exclusão e integridade concorrente; unicidade em índices reais.
- `date` versus `datetime` em limites de fuso e DST.
- Compatibilidade de PK/FK e metadados de sequence/identity.

## Proibições
- Não executar `db:drop`, `db:reset`, `db:migrate` em produção ou `ALTER TABLE` destrutivo sem aprovação.
- Não assumir transação reversível de DDL Oracle.
- Não copiar migration específica PostgreSQL para MariaDB/Oracle cegamente.
- Não esconder falhas de test suite ou dependências de adapter.
