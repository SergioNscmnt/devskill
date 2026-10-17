# PostgreSQL — Active Record Rails 8

- Gem `pg`, adapter `postgresql`. Checar versão de servidor e Rails.
- IDs inteiros: `bigint` default comum em tabelas novas. Se UUID: `create_table :things, id: :uuid`; confirmar geração de UUID e extensão/função disponível conforme banco.
- Preferir `jsonb` para consultas e indexação; `t.jsonb :metadata, null: false, default: {}`. Índices GIN apenas quando consultas justificam.
- `t.datetime` geralmente vira `timestamp without time zone`. Para `timestamptz`, configurar `PostgreSQLAdapter.datetime_type` na versão adequada ou tipo específico suportado; verificar DDL.
- Arrays, ranges, `citext`, enums nativos e constraints específicas não são portáveis; documentar extensão e adaptações.
- `add_index ..., algorithm: :concurrently` requer `disable_ddl_transaction!` e versão suportada. Elaborar rollback.
- Índice único sensível a caixa pode precisar normalização, expressão `LOWER()` ou `citext`.

```ruby
# Ajustar a versão da Migration para ActiveRecord instalado.
class CreateInvoices < ActiveRecord::Migration[8.0]
  def change
    create_table :invoices do |t|
      t.string :number, null: false, limit: 40
      t.decimal :total, precision: 18, scale: 2, null: false
      t.jsonb :metadata, null: false, default: {}
      t.timestamps
    end
    add_index :invoices, :number, unique: true
  end
end
```

Verificar: `information_schema.columns`, `pg_catalog`, `db:schema:dump` e testes reais.
Referência: https://guides.rubyonrails.org/active_record_postgresql.html
