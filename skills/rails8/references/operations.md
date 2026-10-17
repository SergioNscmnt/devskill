# Configuração, observabilidade e deploy

- Identificar Ruby/Rails exatos, plataforma, adapter e forma de execução (`bin/dev`, containers, Kamal, etc.).
- Rails 8 recém-gerado pode usar Propshaft, importmap/jsbundling, Solid Cache/Queue/Cable; verificar antes de presumir.
- Configuração diferente para development/test/production; `ENV.fetch` para valores obrigatórios, credenciais via secret manager.
- Conexões de bancos separados (primary/cache/queue/cable), migrações/schema e permissões devem ser verificadas para o ambiente real.
- Health checks não devem expor informações; observar uptime do web e workers, latência de banco, backlog e falhas.
- Operações destrutivas (`db:drop`, `db:reset`, `db:migrate` em produção, truncate, limpar filas/cache) só com autorização explícita e plano de rollback.
- Analisar deploy de mudanças de schema em fases expand/contract para zero downtime.
- Adicionar logs estruturados e métricas sem segredos; tracing não deve conter payloads sensíveis.
- Gerenciar timezone, horário de jobs recorrentes e limites de concorrência.
- `bundle exec` / `bin/rails` respeitando lockfile para execução reprodutível.
- Checar advisories recentes antes de recomendações concretas de versão de gems.
