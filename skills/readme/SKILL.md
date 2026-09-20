---
name: readme
description: Use para criar ou atualizar um README.md fiel à aplicação.
---
# Skill: README da Aplicação

## Objetivo

Criar ou atualizar o arquivo `README.md` da aplicação de forma clara, objetiva e fiel ao projeto.

O README deve permitir que outro desenvolvedor entenda rapidamente:

* o que a aplicação faz;
* quais tecnologias utiliza;
* como configurar o ambiente;
* como executar o projeto;
* como executar testes;
* como acessar serviços auxiliares;
* quais variáveis de ambiente são necessárias.

---

## Regras Gerais

Antes de alterar o `README.md`:

1. Analise a estrutura do projeto.
2. Identifique a stack realmente utilizada.
3. Verifique arquivos de configuração existentes.
4. Não invente comandos, dependências, portas ou variáveis.
5. Reutilize os comandos definidos pelo próprio projeto.
6. Preserve informações relevantes já existentes no README.
7. Remova informações obsoletas quando houver evidência no código.
8. Escreva em português brasileiro.

Priorize um README curto, técnico e fácil de consultar.

---

## Estrutura do README

Utilize, quando aplicável:

````md
# Nome da Aplicação

Breve descrição da aplicação.

## Tecnologias

- Tecnologia
- Framework
- Banco de dados
- Serviços relevantes

## Requisitos

Dependências necessárias para executar o projeto.

## Configuração

Passos necessários para configurar o ambiente.

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `VARIAVEL` | Descrição |

Nunca informar valores reais de senhas, tokens ou credenciais.

## Instalação

```bash
comando
````

## Banco de Dados

```bash
comando
```

## Executando a Aplicação

```bash
comando
```

Informar a URL local quando puder ser determinada pelo projeto.

## Docker

Quando houver Docker:

```bash
docker compose up -d
```

Adicionar somente comandos compatíveis com o `compose.yaml` ou `docker-compose.yml` existente.

## Testes

```bash
comando
```

## Qualidade e Segurança

Quando existirem ferramentas no projeto, documentar comandos como:

```bash
comando-de-lint
comando-de-auditoria
comando-de-seguranca
```

## Estrutura do Projeto

Documentar somente diretórios relevantes:

```text
app/
config/
db/
spec/
```

## Serviços

Quando aplicável, informar serviços utilizados, como:

* banco de dados;
* Redis;
* armazenamento S3;
* filas;
* SMTP;
* APIs externas.

Não informar credenciais.

## Licença

Adicionar somente quando existir uma licença definida no projeto.

````

---

## Docker

Se o projeto utilizar Docker, analise:

- `Dockerfile`;
- `compose.yaml`;
- `docker-compose.yml`;
- arquivos relacionados.

Documente os comandos reais para:

```bash
docker compose build
docker compose up -d
docker compose down
docker compose logs -f
````

Não incluir comandos que não façam sentido para o projeto.

---

## Variáveis de Ambiente

Identifique as variáveis diretamente no código ou arquivos de exemplo, como:

```text
.env.example
.env.sample
docker-compose.yml
config/
```

Documente apenas o nome e a finalidade.

Exemplo:

```md
| Variável | Descrição |
|---|---|
| `DB_NAME` | Endereço ou nome do banco de dados |
| `DB_USERNAME` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
```

Nunca copiar valores reais de:

* senhas;
* tokens;
* chaves privadas;
* secrets;
* credenciais de serviços;
* `RAILS_MASTER_KEY`.

---

## Comandos

Prefira comandos existentes no projeto.

Verifique arquivos como:

```text
package.json
Gemfile
Makefile
bin/
scripts/
Procfile
compose.yaml
```

Não invente scripts.

---

## Atualização do README

Ao atualizar um README existente:

* preserve informações válidas;
* atualize versões e comandos obsoletos;
* remova instruções que não correspondem mais ao projeto;
* mantenha a organização existente quando adequada;
* evite reescrever o documento inteiro sem necessidade.

---

## Restrições

Não:

* inventar funcionalidades;
* inventar requisitos;
* expor credenciais;
* adicionar documentação genérica desnecessária;
* criar seções vazias;
* adicionar badges sem necessidade;
* adicionar informações que não possam ser confirmadas pelo projeto.

---

## Resultado Esperado

O `README.md` deve ser suficiente para que um desenvolvedor consiga:

1. entender a finalidade da aplicação;
2. preparar o ambiente;
3. instalar as dependências;
4. configurar as variáveis necessárias;
5. executar a aplicação;
6. executar os testes;
7. identificar os principais serviços utilizados.

Priorize precisão, simplicidade e baixa verbosidade.
