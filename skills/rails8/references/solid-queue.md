# Solid Queue / Active Job

- Confirmar `solid_queue`, `config/queue.yml`, `db/queue_schema.rb` e `config.active_job.queue_adapter` no ambiente alvo.
- Jobs executam fora do request, podem falhar/reexecutar; garantir idempotência para efeitos externos.
- Passar IDs ou argumentos pequenos/serializáveis; recarregar recursos e revalidar acesso/estado no `perform`.
- Preferir `perform_later`; usar `perform_now` somente quando há necessidade real de execução síncrona.
- Tratar erros transitórios com `retry_on` (espera e limite), permanentes com `discard_on` quando adequado; não silenciar falhas inesperadas.
- Configurar timeouts de chamadas externas, limites de concorrência e filas com base em carga, banco e throughput.
- Evitar enqueue antes do commit quando job depende da linha recém-criada: usar padrão after-commit suportado pela versão.
- Separar jobs de operações críticas; observabilidade em logs sem PII, duração, backlog, retries e dead jobs.
- Recorrência: avaliar arquivo/configuração `config/recurring.yml`, idempotência e timezone.

```ruby
class SyncCustomerJob < ApplicationJob
  queue_as :default
  retry_on Net::OpenTimeout, wait: 10.seconds, attempts: 3

  def perform(customer_id)
    customer = Customer.find_by(id: customer_id)
    return unless customer
    # Executar serviço idempotente com timeout e chave de idempotência externa.
  end
end
```
Não utilizar esse esqueleto sem preencher a operação e a política de observabilidade.

Referências:
- https://guides.rubyonrails.org/active_job_basics.html
- https://github.com/rails/solid_queue
