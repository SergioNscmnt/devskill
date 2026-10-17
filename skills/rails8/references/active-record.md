# Active Record, validações e persistência

## Regras
- Nomear associações com `dependent:` consciente; não escolher `:destroy` automaticamente.
- Validar invariantes com `validates`; adicionar `NOT NULL`, FKs, `CHECK` e índices únicos no banco quando necessários para concorrência/integridade.
- `validates :email, uniqueness: true` não substitui índice único no banco.
- `presence` e `null: false` não são equivalentes: string vazia pode passar por NOT NULL. Normalizar quando apropriado.
- Validar `numericality`, limites, formato e enumerados sob regras do domínio; índices devem refletir acesso real.
- Em operações concorrentes, usar transações e locks otimistas/pessimistas se o caso requerer.
- Migrations devem ser compatíveis com o banco utilizado e com estratégia de rollout; em tabelas grandes avaliar lock, backfill, índice concorrente e deploy em fases.
- Evitar queries dentro de loops; medir e escolher `includes`, `preload` ou `eager_load` intencionalmente.
- Não usar `update_columns`, `update_all`, `save(validate: false)` ou callbacks ignorados para contornar regra sem justificar.
- Em SQL customizado, bind params e allowlist para nomes de colunas/ordenação.

## Exemplo
```ruby
class Account < ApplicationRecord
  has_many :projects, dependent: :restrict_with_exception

  validates :name, presence: true, length: { maximum: 120 }
  validates :slug, presence: true,
                   format: { with: /\A[a-z0-9-]+\z/ },
                   uniqueness: true
end
```
```ruby
class AddUniqueIndexToAccountsSlug < ActiveRecord::Migration[8.0]
  def change
    add_index :accounts, :slug, unique: true
  end
end
```
O número da migration deve corresponder à versão de Active Record do projeto, não ser copiado cegamente. Tratar registros duplicados preexistentes **antes** de aplicar o índice.

## Regras de domínio
- Model valida estado; transação garante operação indivisível dentro do mesmo banco.
- Para multi-tenant, todas as queries e unicidades devem observar o tenant; índice composto quando apropriado.
- Mudanças de schema: explicar compatibilidade com código em execução, rollback e possíveis impactos.
