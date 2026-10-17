# Arquitetura Rails 8: MVC, services e helpers

## Padrão
- **Controller:** carregar recurso com escopo autorizado, validar params fortes, orquestrar caso de uso, escolher resposta HTML/Turbo/JSON; não escrever SQL dinâmico ou regras de negócio extensas.
- **Model:** associações, validações, escopos legíveis, invariantes e métodos de domínio coesos. Evitar callbacks com I/O externo ou efeitos colaterais ocultos.
- **Service / objeto de domínio:** usar quando há múltiplos modelos, transação, integração externa ou fluxo complexo. Um serviço sem benefício claro aumenta complexidade.
- **Helper:** formatação e apresentação. Evitar consultas e autorização nele.
- **Concern:** compartilhar comportamento relacionado e pequeno; não servir para ocultar acoplamento ou criar “god objects”.
- **Policy/authorization:** seguir mecanismo existente, escopar queries ao usuário/tenant e verificar permissões no servidor.
- **POROs:** preferir objetos simples para regras isoláveis.

## Exemplo ilustrativo — criação transacional
```ruby
# app/services/orders/create.rb
module Orders
  class Create
    def initialize(customer:, items:)
      @customer = customer
      @items = items
    end

    def call
      Order.transaction do
        order = @customer.orders.create!
        @items.each do |item|
          order.order_items.create!(product: item.fetch(:product),
                                   quantity: item.fetch(:quantity))
        end
        order
      end
    end
  end
end
```
- Validar a entrada real antes de usar o serviço, considerar concorrência e constraints.
- Não fazer chamada HTTP para outro serviço dentro de uma transação de banco longa.
- Tratar falhas esperadas explicitamente (`ActiveRecord::RecordInvalid`, etc.), sem `rescue StandardError` genérico.
- Após commit, considerar `after_commit` ou mecanismo transacional adequado para agendar efeitos externos, conforme infraestrutura real.

## Controllers
- `before_action` para carregamento/autorização compartilhados; preferir escopos de acesso.
- `params.require(...).permit(...)` ou mecanismo equivalente da versão existente; apenas campos permitidos.
- Utilizar convenções REST, retornos HTTP corretos, `redirect_to` / `render` claros.
- Não permitir IDOR (`Model.find(params[:id])` sem escopo/autorização em recursos privados).
- Paginação nas listagens com volume potencialmente alto.
