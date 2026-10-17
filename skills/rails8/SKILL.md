---
name: rails8
description: "Implementa, revisa e refatora aplicações Ruby on Rails 8 com Active Record, validações, controllers, services, helpers, Hotwire (Turbo/Stimulus), Solid Cache, Solid Queue e dependências seguras. Use em tarefas de desenvolvimento, manutenção, performance e segurança Rails 8."
---

# Rails 8 — padrões de desenvolvimento

## Objetivo
Entregar alterações idiomáticas, seguras, testáveis e compatíveis com a versão efetiva de Rails 8, Ruby e com o projeto existente. Priorizar recursos nativos antes de gems ou infraestrutura extra.

## Ativação e escopo
- Aplicar quando a tarefa envolver Rails 8, Ruby, Active Record, Hotwire, background jobs, caching, APIs ou dependências Rails.
- Antes de codificar, identificar versões (`Gemfile.lock`, `.ruby-version`), adaptador de banco, sistema de testes, autenticação, autorização, front-end, deploy e convenções locais.
- Não migrar arquitetura, remover bibliotecas nem atualizar versões fora do escopo sem justificar impacto e obter autorização para mudanças disruptivas.
- Instruções explícitas do usuário e convenções do repositório prevalecem quando seguras; registrar divergências relevantes.

## Regras obrigatórias
1. **Rails idiomático:** controllers finos; models encapsulam invariantes/associações; services ou objetos de domínio somente para fluxos complexos; helpers para apresentação, jamais regras de negócio.
2. **Dados corretos:** validações de aplicação + constraints/índices de banco para integridade crítica. Usar migrations reversíveis quando viável e analisar riscos de deploy/dados.
3. **Consultas seguras:** preferir Active Record, parâmetros vinculados, `includes`/`preload` conforme necessário; nunca interpolar entrada em SQL.
4. **Autenticação/autorização:** exigir verificações no servidor em cada ação/recurso; Turbo e Stimulus não substituem controles de acesso.
5. **Hotwire progressivo:** HTML sem JavaScript deve continuar útil quando viável; Turbo Frames/Streams para atualizações parciais, Stimulus para comportamento local; respeitar acessibilidade e estados de erro.
6. **Solid Cache:** usar chaves estáveis/versionadas, TTL ou estratégia de invalidação; não guardar segredos nem usar cache como fonte da verdade.
7. **Solid Queue:** jobs pequenos, idempotentes e observáveis; políticas de retry/discard explícitas, timeouts, serialização mínima, filas e workers configurados.
8. **Dependências:** preferir Rails/standard library; para gems novas avaliar manutenção, origem, licença, compatibilidade, segurança e custo operacional. Não declarar ausência de vulnerabilidades sem auditoria atual.
9. **Segurança:** evitar credenciais hardcoded, mass assignment, XSS, CSRF, SSRF, open redirects, vazamento em logs; proteger uploads e endpoints.
10. **Mudança mínima:** preservar contratos e cobertura, executar verificações proporcionais ao risco, não executar comandos destrutivos em produção sem autorização.

## Fluxo de execução
1. Inspecionar o projeto e localizar o comportamento existente.
2. Escolher a referência pertinente, **sem carregar todas automaticamente**.
3. Definir o menor plano necessário, com riscos (dados, segurança, jobs, concorrência, cache).
4. Implementar conforme convenções locais e criar/ajustar testes focados.
5. Executar validações relevantes disponíveis, começando pelas mais rápidas; não presumir resultados.
6. Informar arquivos alterados, decisões, testes efetivamente executados, riscos e pendências.

## Critérios de aceite
- Requisito atendido e compatível com stack realmente instalada.
- Regras de negócio em camada adequada, authorization server-side e entradas validadas.
- Integridade de dados protegida quando aplicável; sem N+1 introduzido inadvertidamente.
- Interfaces Turbo/Stimulus mantêm comportamento coerente, acessível e tratam erros.
- Jobs toleram reexecução; cache tem invalidação/expiração planejada.
- Dependências examinadas e scanners executados quando disponíveis; achados explicitados.
- Testes relevantes executados ou impossibilidade documentada. Não afirmar cobertura ou segurança absoluta.

## Referências sob demanda
- MVC, service objects e helpers → [architecture.md](references/architecture.md)
- Active Record, migrations e `validates` → [active-record.md](references/active-record.md)
- Turbo, Frames, Streams e Stimulus → [hotwire.md](references/hotwire.md)
- Solid Cache → [solid-cache.md](references/solid-cache.md)
- Solid Queue / Active Job → [solid-queue.md](references/solid-queue.md)
- Segurança, gems e auditorias → [security-dependencies.md](references/security-dependencies.md)
- Testes e performance → [testing-performance.md](references/testing-performance.md)
- Padrões de configuração e produção → [operations.md](references/operations.md)

## Scripts (somente leitura por padrão)
- `python3 scripts/validate_skill.py` verifica a estrutura desta skill.
- `python3 scripts/inspect_rails.py /caminho/do/projeto` inventaria arquivos/configurações sem ler segredos.
- `bash scripts/audit_rails.sh /caminho/do/projeto` executa verificações de dependências e segurança disponíveis; não instala gems nem altera lockfile.

## Modelos
- [Plano de alteração](assets/templates/implementation-plan.md)
- [Checklist de revisão](assets/templates/review-checklist.md)
- [Resumo de entrega](assets/templates/delivery-summary.md)

## Fontes oficiais
- https://guides.rubyonrails.org/
- https://turbo.hotwired.dev/handbook/introduction
- https://stimulus.hotwired.dev/handbook/introduction
- https://github.com/rails/solid_cache
- https://github.com/rails/solid_queue
- https://brakemanscanner.org/
