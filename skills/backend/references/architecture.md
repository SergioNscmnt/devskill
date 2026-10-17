# Arquitetura e manutencao

## Ordem de prioridades
1. Correcao funcional e invariantes de dominio.
2. Compatibilidade com contratos e arquitetura existentes.
3. Seguranca, observabilidade e testabilidade.
4. Simplicidade, legibilidade e evolucao sustentavel.

## Diretrizes
- Estude padroes locais antes de introduzir novas camadas, pastas ou bibliotecas.
- Coloque regras de negocio onde possam ser testadas sem dependencia desnecessaria de transporte ou infraestrutura.
- Controllers/handlers devem orquestrar requisicoes, autenticacao, validacao e respostas, nao concentrar regras de negocio complexas.
- Separe acesso a dados de regras de dominio quando houver ganho real; nao construa repository generico por padrao.
- Use contratos explicitos, nomes descritivos e limites claros entre modulos.
- Prefira composicao a heranca quando reduzir acoplamento.
- Aplique SOLID de forma pragmatica: responsabilidade unica, extensao sem alteracoes dispersas, substituicao correta, interfaces focadas e dependencia de abstracoes onde necessario.
- Evite duplicacoes significativas, mas nao crie generalizacoes para dois trechos superficialmente parecidos.

## Modificacoes legadas
- Caracterize comportamento atual com testes direcionados antes de refatoracoes arriscadas.
- Diferencie correcao de bug de mudanca deliberada de regra.
- Preservar nomes de campos e contratos usados por clientes ate planejar versionamento/migracao.
- Diga explicitamente quando codigo existente foge do ideal e a mudanca solicitada nao justifica reforma ampla.

## Avaliacao rapida
- Esta alteracao tem uma unica responsabilidade clara?
- A dependencia nova e indispensavel?
- A logica de dominio esta testavel?
- O custo operacional e a compatibilidade foram considerados?
