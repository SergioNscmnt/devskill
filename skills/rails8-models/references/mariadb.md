# MariaDB — Rails 8

- Confirmar versão/compatibilidade do servidor MariaDB e do adapter (`mysql2` ou `trilogy` se suportado pelo projeto); não tratar MariaDB como idêntico ao MySQL para DDL/JSON.
- `t.boolean` tipicamente converte para `TINYINT(1)`; não impõe domínio true/false no banco sem CHECK. Adapter geralmente converte `tinyint(1)` para booleano.
- `JSON` em MariaDB é alias para `LONGTEXT` com validação JSON em versões aplicáveis, não binário `jsonb` de PostgreSQL; diferenças de indexação e funções são importantes.
- Strings usam charset/collation (`utf8mb4` recomendado quando compatível). Unicidade é afetada pela collation/case sensitivity e comprimento de índices.
- Decimal para dinheiro com precisão/escala; cuidado com limite de tipos inteiros e opções UNSIGNED, que não são inteiramente portáveis.
- `datetime` não contém timezone; salvar instantes normalizados UTC na aplicação e validar timezones em leitura/escrita.
- FKs precisam engine adequada (normalmente InnoDB), tipo/sinal compatíveis, índice e mesma collation para colunas textuais relacionadas.
- `TEXT` tem limites diferentes (`TINYTEXT`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`); verificar DDL/limites ao usar `t.text`.
- CHECK e online DDL dependem de versão e operação; validar bloqueios e efeito de migrações grandes.

```ruby
class CreateInvoices < ActiveRecord::Migration[8.0]
  def change
    create_table :invoices do |t|
      t.string :number, null: false, limit: 40
      t.decimal :total, precision: 18, scale: 2, null: false
      t.boolean :paid, null: false, default: false
      t.timestamps
    end
    add_index :invoices, :number, unique: true
  end
end
```

Inspecionar `SHOW CREATE TABLE invoices`, `information_schema.columns`, charset e collations. Não assumir que `CHECK` é aplicado sem testar.
