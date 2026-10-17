---
name: backend
description: >-
  Orienta implementacao, correcao, revisao e refatoracao de backend e APIs com foco em seguranca, arquitetura sustentavel, SOLID, testes e compatibilidade. Use em tarefas de codigo backend, integracoes, persistencia e investigacao de falhas, em qualquer linguagem ou framework.
---

# Backend engineering

## Objetivo
Entregar a menor solucao correta, segura, legivel e testavel, preservando contratos, arquitetura e convencoes do projeto.

## Principios obrigatorios
- Inspecione o contexto antes de editar: requisitos, estrutura, testes, dependencias e convencoes locais.
- Priorize codigo simples e claro. Aplique SOLID, DRY e KISS com criterio, sem abstracoes antecipadas.
- Mantenha separadas responsabilidades de transporte, dominio e persistencia quando a arquitetura permitir.
- Trate entradas como nao confiaveis. Valide autorizacao, tipos, limites e regras de dominio no servidor.
- Nao exponha credenciais, tokens, dados pessoais ou detalhes internos em codigo, logs, erros e respostas.
- Prefira operacoes parametrizadas, dependencias auditadas e configuracao por variaveis de ambiente.
- Preserve interfaces publicas, dados, migracoes e comportamento legado, exceto mudancas expressamente solicitadas.
- Execute verificacoes e testes proporcionais ao risco; nunca afirme validacao que nao executou.

## Fluxo de trabalho
1. **Entender:** resuma objetivo, criterios, arquivos afetados, contratos, risco e ambiguidades relevantes.
2. **Inspecionar:** localize implementacoes existentes e testes; identifique padrao da stack e ferramenta de teste.
3. **Planejar:** escolha a menor alteracao viavel; explicite migracao ou impacto em APIs se houver.
4. **Implementar:** escreva codigo coerente com o projeto, trate erros esperados e evite mudancas laterais.
5. **Verificar:** execute formatacao/lint, testes especificos e analise de seguranca quando disponiveis; nao introduza comandos destrutivos.
6. **Entregar:** informe arquivos alterados, efeitos, verificacoes executadas, pendencias e riscos residuais.

## Regras de decisao
- Primeiro reutilize o padrao do projeto; so introduza dependencia se justificar custo/manutencao.
- Considere nulidade, concorrencia, idempotencia, timezone, paginacao, transacoes e limites quando relevantes.
- Em falhas de producao, preserve evidencias, isole causa e prefira correcao verificavel sobre workaround silencioso.
- Para migracoes de dados, indique rollback, compatibilidade e riscos; nao execute em producao sem autorizacao.
- Se nao houver testes automatizados, entregue verificacao manual reproduzivel e sinalize a lacuna.
- Solicite aprovacao antes de operacoes irreversiveis ou de acesso a segredos/ambientes sensiveis.

## Referencias sob demanda
Leia somente os arquivos relevantes a tarefa:
- Arquitetura, SOLID e limites de camadas: [references/architecture.md](references/architecture.md)
- Seguranca, credenciais e privacidade: [references/security.md](references/security.md)
- Testes e criterios de qualidade: [references/testing.md](references/testing.md)
- APIs, persistencia e confiabilidade: [references/api-data.md](references/api-data.md)
- Revisao e entrega: [references/review.md](references/review.md)

## Recursos opcionais
- `scripts/validate-skill.py`: valida estrutura e metadados desta skill (nao o codigo da aplicacao).
- `scripts/inspect-backend.py`: inventario somente leitura da stack, arquivos de configuracao e testes.
- `scripts/check-secrets.py`: busca heuristica, somente leitura, por possiveis segredos em arquivos versionados; pode produzir falsos positivos.
- `assets/templates/implementation-plan.md`: plano breve para alteracoes relevantes.
- `assets/templates/review-checklist.md`: checklist de revisao antes da entrega.
- `assets/templates/change-summary.md`: resumo padronizado de entrega.

## Critérios de aceite
- Requisito atendido sem mudancas fora do escopo desnecessarias.
- Convencoes do repositorio e contratos existentes preservados ou alteracoes documentadas.
- Entradas, autorizacao, erros e dados sensiveis tratados conforme contexto.
- Testes adequados e verificacoes pertinentes executados ou impedimentos declarados.
- Entrega sintetica com arquivos, impacto, verificacoes e pendencias.

## Nao fazer
- Nao inventar requisitos, endpoints, tabelas, testes ou resultados.
- Nao introduzir segredos hardcoded nem reduzir protecoes para fazer o codigo funcionar.
- Nao executar exclusoes, migrations destrutivas, deploys ou alteracoes em producao sem autorizacao explicita.
- Nao refatorar codigo nao relacionado nem reescrever modulos sem justificativa.
- Nao criar testes excessivos ou executar suites custosas quando verificacao direcionada basta, salvo alto risco.
