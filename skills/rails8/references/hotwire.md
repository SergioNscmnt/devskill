# Hotwire: Turbo + Stimulus em Rails 8

## Orientação
- Preferir fluxo HTML/REST e progressive enhancement.
- **Turbo Drive:** navegação/formulários; validar redirects e respostas HTTP. Após POST bem-sucedido, normalmente redirect; erros de validação renderizam `422 :unprocessable_entity` com form e erros.
- **Turbo Frames:** escopo de fragmentos, ids estáveis e tratamento de respostas sem frame correspondente.
- **Turbo Streams:** `append`, `prepend`, `replace`, `update`, `remove`, `morph` quando suportados pela versão instalada. Evitar atualizações duplicadas e vazamentos entre usuários.
- **Stimulus:** controllers pequenos, targets/values/actions declarativos; registrar/desregistrar listeners externos em `connect`/`disconnect`; evitar usar Stimulus como store de regras do servidor.
- Para broadcast em tempo real, autorização dos streams e isolamento por conta/tenant são obrigatórios. Confirmar adaptador de Action Cable/Solid Cable.
- Componentes de UI: HTML semântico, labels, foco após modal/erros, `aria-live` quando pertinente, estados loading/erro e teclado.
- Evitar scripts inline e HTML não confiável marcado `html_safe`; Rails escaping padrão.

## Exemplo de formulário com erro
```ruby
def create
  @task = current_user.tasks.new(task_params)
  if @task.save
    redirect_to @task, notice: "Tarefa criada"
  else
    render :new, status: :unprocessable_entity
  end
end
```

## Exemplo Stimulus
```javascript
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["output"]
  static values = { count: Number }

  increment() {
    this.countValue += 1
    this.outputTarget.textContent = this.countValue
  }
}
```

## Testar
- Teste de request cobre resposta, status e autorização.
- Teste de sistema cobre navegação Turbo, mudanças de DOM, teclado e erros quando necessário.
- Garantir que atualizações por stream não exponham IDs/dados de outros usuários.
