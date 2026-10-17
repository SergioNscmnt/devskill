# Testes e performance

## Estratégia por risco
1. Testar alterações no nível mais barato que capte o requisito: unit/model/service -> request -> integration/system.
2. Cobrir regras de validação, autorização, erros, casos de concorrência e contratos alterados.
3. Mockar apenas bordas externas; não mockar a própria lógica que se pretende validar.
4. Jobs: testar enqueue e `perform` separadamente; reexecução e retries nos casos críticos.
5. Hotwire: request para status/response e system para interações reais Turbo/Stimulus.
6. Não rodar suite inteira a cada edição pequena; rodar suite completa ao final se mudança transversal e recursos permitirem.
7. Usar factories/fixtures existentes, deterministic tests, isolamento de estado, limpeza de cache/jobs e relógio controlado se pertinente.

## Performance
- Observar N+1, índices, `EXPLAIN` e queries repetidas em views/helpers.
- Usar `find_each`/`in_batches` para alto volume com critérios de ordem e atualização seguros.
- Evitar `Model.all.map` para agregações que o SQL resolve com `count`, `sum`, `group`.
- Cache somente com medição, consistência e invalidação planejadas.
- Verificar latência de jobs/filas, conexões disponíveis e load do banco.

## Comandos comuns (adaptar ao projeto)
```bash
bin/rails test test/models/some_model_test.rb
bin/rails test test/controllers/some_controller_test.rb
bin/rails test:system
bundle exec rspec spec/models/some_model_spec.rb
```
Executar somente os comandos suportados pelo framework de testes detectado. Informar claramente testes não executados.
