---
name: backend
description: Use para implementar ou refatorar código backend simples, seguro e testável.
---

# Backend

## Objetivo Principal

Orientar a criação, alteração, revisão e refatoração de código backend de forma:

* simples;
* legível;
* testável;
* manutenível;
* coesa;
* desacoplada;
* consistente com o projeto;
* alinhada aos princípios SOLID.

A skill é independente de linguagem, framework, banco de dados ou arquitetura específica.

Sempre respeite os padrões e convenções já existentes no projeto.

---

# Regras

## 1. Analisar Antes de Implementar

Antes de modificar código:

1. Analise a estrutura do projeto.
2. Identifique arquitetura e padrões existentes.
3. Localize o código relacionado à tarefa.
4. Procure implementações semelhantes.
5. Identifique dependências e impactos.
6. Implemente apenas o necessário.

Não introduza novos padrões quando o projeto já possuir uma solução adequada.

---

## 2. Aplicar SOLID

### Single Responsibility

Cada módulo, classe, função ou componente deve possuir uma responsabilidade clara.

Evite misturar responsabilidades diferentes na mesma unidade de código.

---

### Open/Closed

Prefira estruturas que possam ser estendidas sem alterações frequentes em código estável.

Não crie abstrações antecipadamente sem necessidade atual.

---

### Liskov Substitution

Implementações devem respeitar contratos e comportamentos esperados pelas abstrações utilizadas.

---

### Interface Segregation

Prefira contratos pequenos e específicos.

Não obrigue consumidores a depender de comportamentos que não utilizam.

---

### Dependency Inversion

Regras de negócio devem depender de abstrações apropriadas quando isso reduzir acoplamento.

Evite acoplamento desnecessário entre domínio e detalhes de infraestrutura.

---

## 3. Separar Responsabilidades

Organize o fluxo de forma clara.

Exemplo conceitual:

```text
entrada
↓
validação
↓
regra de negócio
↓
persistência / integração
↓
resposta
```

Separe quando aplicável:

* domínio;
* aplicação;
* persistência;
* infraestrutura;
* transporte;
* apresentação.

Evite concentrar toda a lógica em:

* controllers;
* handlers;
* routes;
* endpoints;
* models;
* classes utilitárias genéricas.

---

## 4. Manter Baixo Acoplamento

Evite dependências desnecessárias entre componentes.

Uma alteração em um módulo não deve exigir modificações em diversas partes não relacionadas do sistema.

Prefira dependências explícitas.

Evite dependências globais e efeitos colaterais ocultos.

---

## 5. Manter Alta Coesão

Agrupe comportamentos relacionados.

Cada módulo deve possuir propósito claro.

Não utilize classes ou módulos genéricos que concentrem responsabilidades sem relação direta.

---

## 6. Funções e Métodos

Prefira funções e métodos:

* pequenos;
* previsíveis;
* focados;
* facilmente testáveis;
* com nomes claros;
* com poucos parâmetros.

Evite:

* funções excessivamente longas;
* múltiplos níveis de responsabilidade;
* efeitos colaterais inesperados;
* parâmetros booleanos ambíguos em excesso.

---

## 7. Nomenclatura

Nomes devem representar intenção.

Prefira nomes específicos:

```text
calculateTotal
validateOrder
findActiveUser
createInvoice
```

Evite nomes excessivamente genéricos:

```text
process
data
helper
manager
utils
execute
```

quando não deixarem clara a responsabilidade.

Respeite sempre as convenções da linguagem utilizada.

---

## 8. Regras de Negócio

Regras de negócio devem ser:

* explícitas;
* centralizadas;
* testáveis;
* independentes de detalhes desnecessários de infraestrutura.

Evite duplicar a mesma regra em diferentes pontos da aplicação.

Quando houver uma regra já implementada, reutilize-a sempre que apropriado.

---

## 9. Persistência

Separe regras de negócio do mecanismo de persistência quando apropriado.

Evite:

* consultas duplicadas;
* acesso desnecessário ao banco;
* consultas em loops quando evitável;
* carregamento excessivo de dados;
* dependência direta de persistência em todas as camadas.

Utilize transações quando uma operação exigir consistência entre múltiplas alterações.

---

## 10. APIs e Contratos

Ao alterar uma interface pública:

* preserve compatibilidade quando possível;
* mantenha contratos consistentes;
* evite alterações desnecessárias;
* identifique consumidores antes de modificar o comportamento.

Não altere respostas, parâmetros ou contratos existentes sem necessidade.

---

## 11. Integrações Externas

Mantenha integrações externas desacopladas da regra de negócio quando apropriado.

Isole dependências como:

* APIs;
* filas;
* serviços;
* armazenamento;
* mensageria;
* provedores externos.

Evite espalhar lógica específica de integração pelo domínio.

---

## 12. Código Assíncrono

Ao trabalhar com:

* jobs;
* filas;
* workers;
* eventos;
* tarefas assíncronas;

mantenha responsabilidades claras.

Evite colocar grande quantidade de regra de negócio diretamente no worker.

O worker deve preferencialmente coordenar a execução de serviços ou casos de uso.

---

## 13. Reutilização

Antes de criar:

* serviço;
* função;
* helper;
* classe;
* módulo;
* abstração;

procure uma implementação equivalente no projeto.

Evite duplicação significativa de código ou regra de negócio.

Não crie abstrações genéricas apenas para eliminar pequenas repetições.

---

## 14. Dependências

Não adicionar dependências sem necessidade.

Antes de adicionar uma biblioteca:

1. verifique se o projeto já possui solução equivalente;
2. avalie compatibilidade;
3. avalie manutenção;
4. verifique impacto arquitetural;
5. determine se a dependência realmente simplifica a solução.

Evite bibliotecas para funcionalidades triviais.

---

## 15. Performance

Não realize otimização prematura.

Entretanto, evite padrões evidentemente ineficientes, como:

* N+1;
* consultas repetidas;
* processamento desnecessário;
* chamadas externas dentro de loops;
* carregamento integral quando paginação é suficiente;
* operações bloqueantes desnecessárias.

Primeiro garanta correção e clareza.

Depois otimize quando existir necessidade real.

---

## 16. Testabilidade

Estruture o código de forma que as regras possam ser testadas isoladamente quando possível.

Priorize testes para:

* regras de negócio;
* validações;
* casos limite;
* fluxos críticos;
* tratamento de erros;
* integrações relevantes.

Não criar testes apenas para aumentar métricas de cobertura.

Teste comportamento, não detalhes internos desnecessários.

---

## 17. Tratamento de Erros

Erros devem possuir tratamento claro e previsível.

Não ignore exceções silenciosamente.

Evite estruturas equivalentes a:

```text
catch(Exception) {}
```

Erros devem ser:

1. tratados quando recuperáveis;
2. propagados quando necessário;
3. registrados quando relevante.

Não utilize exceções como fluxo normal da aplicação.

---

## 18. Compatibilidade

Ao modificar código existente:

* preserve contratos públicos;
* evite mudanças fora do escopo;
* mantenha comportamentos válidos;
* identifique dependências antes de modificar interfaces.

Mudanças incompatíveis devem ocorrer apenas quando necessárias.

---

## 19. Refatoração

Refatore quando houver benefício claro para:

* legibilidade;
* coesão;
* desacoplamento;
* testabilidade;
* manutenção;
* redução de duplicação.

Prefira refatorações pequenas e verificáveis.

Não transforme uma tarefa simples em uma reestruturação completa sem necessidade.

---

## 20. Comentários

Código deve ser compreensível principalmente por sua estrutura e nomenclatura.

Comentários devem explicar:

```text
por que algo existe
```

e não repetir:

```text
o que o código já demonstra
```

Evite comentários desatualizados ou redundantes.

---

## 21. Princípios Complementares

### DRY

Evite duplicação significativa.

### KISS

Prefira a solução mais simples que resolva corretamente o problema.

### YAGNI

Não implemente funcionalidades ou abstrações para necessidades hipotéticas.

### Fail Fast

Detecte estados inválidos o mais cedo possível.

### Separation of Concerns

Mantenha responsabilidades distintas separadas.

### Composition Over Inheritance

Prefira composição quando ela reduzir acoplamento e tornar o código mais simples.

---

# O Que Não Fazer

Não:

* criar classes com responsabilidades excessivas;
* criar funções gigantes;
* concentrar regras de negócio em controllers;
* duplicar regras importantes;
* introduzir dependências desnecessárias;
* criar abstrações prematuras;
* alterar arquitetura sem necessidade;
* reinventar soluções existentes;
* criar funcionalidades fora do escopo;
* realizar grandes refatorações sem necessidade;
* otimizar prematuramente;
* introduzir código morto;
* deixar TODOs desnecessários;
* criar helpers genéricos sem responsabilidade clara;
* ignorar erros silenciosamente;
* criar dependências globais desnecessárias;
* adicionar complexidade apenas para aplicar um padrão;
* aplicar SOLID de forma artificial;
* alterar convenções existentes sem justificativa.

---

# Critérios de Aceite

Uma implementação backend somente deve ser considerada concluída quando os critérios aplicáveis forem atendidos.

## Funcionalidade

* [ ] A tarefa solicitada foi implementada.
* [ ] O comportamento esperado foi preservado.
* [ ] Não foram adicionadas funcionalidades fora do escopo.
* [ ] Casos de erro relevantes foram considerados.

## SOLID

* [ ] Cada componente possui responsabilidade clara.
* [ ] Não existe acoplamento desnecessário.
* [ ] Abstrações possuem finalidade concreta.
* [ ] Contratos são pequenos e adequados aos consumidores.
* [ ] Dependências seguem a arquitetura do projeto.

## Organização

* [ ] Regras de negócio estão em local apropriado.
* [ ] Persistência não está desnecessariamente misturada com domínio.
* [ ] Integrações estão adequadamente isoladas.
* [ ] Não existe concentração excessiva de lógica em controllers ou handlers.

## Qualidade

* [ ] Código está legível.
* [ ] Nomes representam intenção.
* [ ] Funções possuem escopo claro.
* [ ] Código duplicado relevante foi evitado.
* [ ] Não foram criadas abstrações desnecessárias.
* [ ] Não foram introduzidas dependências injustificadas.

## Compatibilidade

* [ ] Contratos existentes foram preservados quando possível.
* [ ] Não existem alterações fora do escopo.
* [ ] Consumidores relevantes foram considerados.

## Persistência

* [ ] Transações são utilizadas quando necessárias.
* [ ] Não foram introduzidas consultas evidentemente ineficientes.
* [ ] Não foi introduzido N+1 conhecido.
* [ ] Dados desnecessários não são carregados sem motivo.

## Testes

* [ ] Testes existentes relevantes continuam válidos.
* [ ] Novas regras possuem testes quando necessário.
* [ ] Casos limite relevantes foram considerados.
* [ ] Testes verificam comportamento relevante.
* [ ] Não foram criados testes redundantes.

## Manutenção

* [ ] Outro desenvolvedor consegue compreender a implementação.
* [ ] A solução é simples para o problema apresentado.
* [ ] Não existem refatorações desnecessárias.
* [ ] O código segue os padrões existentes do projeto.

---

# Fluxo de Execução

Ao executar uma tarefa backend:

```text
1. analisar o projeto
2. localizar código relacionado
3. identificar padrões existentes
4. compreender o fluxo atual
5. definir a menor alteração necessária
6. implementar
7. revisar responsabilidades
8. validar SOLID
9. verificar regressões
10. executar testes relevantes
11. revisar critérios de aceite
```

---

# Integração com Segurança

Regras relacionadas a:

* credenciais;
* secrets;
* tokens;
* chaves;
* dados sensíveis;
* autenticação;
* autorização;
* exposição de informações;
* criptografia;
* segurança de logs;
* segurança de infraestrutura;

devem seguir a skill:

```text
application-security
```

Não duplicar essas regras nesta skill.

---

# Regra Final

Não tente criar a arquitetura mais sofisticada possível.

Prefira a solução mais simples que seja:

```text
correta
coesa
desacoplada
testável
legível
manutenível
```

Adapte sempre a implementação à linguagem, framework, arquitetura e convenções existentes no projeto.
