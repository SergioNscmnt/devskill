# Testes e verificacao eficiente

## Estrategia proporcional ao risco
1. Rode primeiro o teste especifico do comportamento modificado.
2. Cubra fluxo nominal, uma falha relevante e limites que podem regredir.
3. Execute testes de integracao quando contratos, banco, fila ou servicos forem alterados.
4. Amplie para suite maior apenas se o raio de impacto justificar ou for exigido pelo projeto.
5. Use formatador, lint, typecheck e scanner de seguranca ja existentes.

## Praticas
- Prefira testes deterministas, sem relogio real, rede externa ou dependencia de ordem.
- Use fixtures/factories pequenas; mocke apenas fronteiras externas onde houver beneficio.
- Teste comportamento publico e regras, evitando acoplamento excessivo a detalhes internos.
- Teste regressao antes ou junto da correcao de bug, quando viavel.
- Nao modifique expectativas para mascarar um defeito.
- Informe claramente quais comandos foram executados, resultados e o que ficou pendente.

## Seletores por ecossistema (somente se a stack usa)
- Ruby: `bundle exec rspec caminho/do_spec.rb` ou testes nativos existentes.
- Node: script de teste do `package.json` com filtro do runner existente.
- Python: `pytest caminho/do_teste.py`.
- .NET: `dotnet test --filter FullyQualifiedName~NomeDoTeste`.
- Java: filtro suportado pelo Maven/Gradle do projeto.

Nunca instalar ferramentas ou substituir runner so para seguir os exemplos.
