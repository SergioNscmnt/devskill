# Models, associações e validações

```ruby
class Customer < ApplicationRecord
  has_many :orders, dependent: :restrict_with_exception, inverse_of: :customer
  validates :document, presence: true, length: { in: 11..14 }
  validates :active, inclusion: { in: [true, false] }
end

class Order < ApplicationRecord
  belongs_to :customer, inverse_of: :orders
  validates :total, numericality: { greater_than_or_equal_to: 0 }
end
```

- CPF/CNPJ: armazenar como string preservando zeros; validar dígitos verificadores em rotina testada quando necessário, não apenas tamanho.
- `belongs_to` normalmente exige associação no Rails moderno; explicitar `optional: true` apenas se domínio permitir NULL.
- Combinar `validates :document, uniqueness: { scope: :tenant_id }` com índice UNIQUE composto no banco; escolher collation/case sensitivity explicitamente.
- Nunca `presence: true` para booleano exigido: `false.blank?` é `true`.
- `default` não substitui backfill; nullability do banco prevalece sobre validates.
- Model não deve executar side-effects externos ocultos em callbacks; usar after_commit/jobs quando adequado.
- Implementar scopes parametrizados e escopo tenant/authorization; evitar `default_scope` com efeitos difíceis de prever.
- Testes para ausência, limites, duplicidade no banco, transações e concorrência.
