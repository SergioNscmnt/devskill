# APIs, dados e confiabilidade

## APIs
- Preserve semantica HTTP, status, headers e payloads; documente mudancas de contrato.
- Valide entradas e tipos; normalize erros sem vazar detalhes internos.
- Considere paginacao, filtros, limites, compatibilidade, idempotencia e versionamento quando relevantes.
- Aplique autorizacao em cada recurso, nao apenas na rota.

## Banco de dados
- Use consultas parametrizadas e indices fundamentados em plano de execucao/necessidade real.
- Revise cardinalidade, N+1, transacoes, concorrencia e nivel de isolamento.
- Trate `NULL`, timezone e precisao monetaria explicitamente; nao use float para dinheiro quando a stack fornece decimal.
- Migracoes devem priorizar compatibilidade entre versoes, backfill separado quando custoso, rollback e estrategia para dados preexistentes.
- Nunca executar operacoes destrutivas sem autorizacao expressa.

## Integracoes e assincronia
- Defina timeout, politica de retries limitada com backoff, tratamento de erros e idempotencia.
- Nao repetir automaticamente operacoes nao idempotentes sem mecanismo de deduplicacao.
- Diferencie falha temporaria, falha permanente e erro de negocio.
- Nao registre payloads com dados sensiveis.

## Observabilidade
- Prefira logs estruturados com correlation/request id e sem dados sensiveis.
- Metricas devem observar erro, latencia e carga sem cardinalidade excessiva.
- Health check deve refletir o contrato ja adotado pelo projeto; nao inventar endpoints.
