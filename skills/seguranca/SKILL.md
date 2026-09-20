---
name: seguranca
description: Use para proteger dados, credenciais e configurações da aplicação.
---

# Segurança da Aplicação

## Objetivo Principal

Garantir que a aplicação não exponha:

* credenciais de banco de dados;
* senhas;
* tokens;
* API keys;
* chaves privadas;
* chaves de acesso;
* secrets;
* cookies de sessão;
* dados pessoais sensíveis;
* informações internas de infraestrutura.

Toda implementação deve seguir o princípio:

```text
nenhum segredo deve existir diretamente no código-fonte
```

Segurança deve ser considerada requisito obrigatório, não opcional.

---

# Regras

## 1. Nunca armazenar secrets no código

Nunca adicionar diretamente ao código:

```text
password
secret
token
api_key
access_key
private_key
database_password
connection_string com credenciais
```

Exemplo proibido:

```text
DB_PASSWORD = "senha123"
API_KEY = "abc123"
```

Utilize mecanismos externos de configuração.

---

## 2. Utilizar variáveis de ambiente

Credenciais e informações sensíveis devem ser fornecidas por configuração externa.

Exemplo conceitual:

```text
DB_HOST
DB_NAME
DB_USERNAME
DB_PASSWORD

API_KEY
ACCESS_TOKEN

ACCESS_KEY_ID
SECRET_ACCESS_KEY
```

O código deve apenas referenciar essas variáveis.

Nunca adicionar valores reais ao repositório.

---

## 3. Utilizar gerenciadores de secrets quando disponíveis

Em ambientes de produção, prefira:

* secret managers;
* vaults;
* serviços de gerenciamento de credenciais;
* secrets do ambiente de execução;
* secrets do CI/CD;
* mecanismos nativos da plataforma.

Evite arquivos locais contendo credenciais em produção.

---

## 4. Arquivos de ambiente

Arquivos como:

```text
.env
.env.local
.env.production
.env.development
```

não devem conter credenciais versionadas.

Quando necessário, adicionar ao controle de versão apenas arquivos de exemplo:

```text
.env.example
.env.sample
```

Esses arquivos devem conter somente nomes de variáveis ou valores fictícios.

Exemplo:

```text
DB_USERNAME=
DB_PASSWORD=
API_KEY=
```

---

## 5. Git e versionamento

Nunca versionar:

* `.env` real;
* certificados privados;
* chaves SSH privadas;
* arquivos de credenciais;
* tokens;
* dumps contendo dados sensíveis;
* backups de produção;
* arquivos de configuração com secrets.

Verifique se arquivos sensíveis estão protegidos pelo mecanismo equivalente ao `.gitignore`.

---

## 6. Credenciais de banco

Credenciais de banco devem ser carregadas externamente.

Nunca utilizar:

```text
host + usuário + senha hardcoded
```

Nunca incluir senha dentro da URL de conexão quando ela puder aparecer em:

* logs;
* mensagens de erro;
* métricas;
* tracing;
* debug.

Utilize usuário exclusivo por aplicação.

Evite contas:

```text
root
admin
sys
system
postgres
```

ou equivalentes administrativos.

A aplicação deve utilizar apenas os privilégios necessários.

---

## 7. Princípio do menor privilégio

Toda credencial deve possuir somente as permissões necessárias para sua função.

Aplicar a:

* banco de dados;
* armazenamento;
* APIs;
* filas;
* serviços externos;
* cloud;
* sistema operacional.

Não conceder privilégios administrativos sem necessidade.

---

## 8. Chaves de acesso

Chaves de acesso devem:

* ficar fora do código;
* possuir permissões mínimas;
* possuir escopo limitado;
* ser rotacionáveis;
* ser revogáveis.

Quando suportado, prefira credenciais temporárias em vez de credenciais permanentes.

---

## 9. Tokens

Tokens nunca devem aparecer em:

* código;
* logs;
* mensagens de erro;
* respostas de API;
* documentação;
* commits;
* screenshots;
* fixtures reais.

Quando necessário registrar contexto, utilize mascaramento.

Exemplo:

```text
abcd********wxyz
```

---

## 10. Senhas

Nunca armazenar senhas em texto puro.

Utilize algoritmo próprio para armazenamento de senha fornecido pelo framework ou biblioteca de segurança apropriada.

Não utilizar para armazenamento de senhas:

```text
MD5
SHA1
SHA256 puro
```

Prefira algoritmos específicos para hashing de senha, como:

```text
Argon2
bcrypt
scrypt
PBKDF2
```

quando suportados pela stack.

---

## 11. Dados sensíveis

Trate como sensíveis, quando aplicável:

* CPF;
* CNPJ;
* documentos;
* endereço;
* telefone;
* e-mail;
* dados financeiros;
* dados médicos;
* credenciais;
* tokens;
* identificadores de sessão;
* informações pessoais privadas.

Colete apenas os dados necessários.

Evite persistir dados que não sejam necessários ao funcionamento da aplicação.

---

## 12. Logs

Nunca registrar diretamente:

```text
password
authorization header
access token
refresh token
session token
cookie
secret
api key
private key
database password
```

Evite registrar payloads completos quando possam conter dados sensíveis.

Prefira logs estruturados e campos explicitamente permitidos.

---

## 13. Mensagens de erro

Não retornar ao usuário:

* stack trace;
* query SQL;
* credenciais;
* caminhos internos;
* nomes internos de infraestrutura;
* configuração do servidor;
* secrets;
* connection strings.

Resposta externa deve ser segura.

Detalhes técnicos devem permanecer apenas em mecanismos internos de observabilidade devidamente protegidos.

---

## 14. APIs

Nunca retornar campos sensíveis apenas porque existem no objeto interno.

Antes de responder uma API, defina explicitamente quais campos podem ser expostos.

Evite serialização automática de objetos contendo:

```text
password_hash
token
secret
private_key
internal_id
credentials
```

---

## 15. Entrada de dados

Toda entrada externa é não confiável.

Validar:

* tipo;
* tamanho;
* formato;
* valores permitidos;
* extensão de arquivos;
* MIME type;
* identificadores;
* parâmetros.

Não confiar somente no frontend.

---

## 16. Proteção contra injeção

Nunca concatenar entrada externa em:

* SQL;
* comandos de sistema;
* queries;
* templates;
* paths;
* scripts.

Utilize mecanismos parametrizados.

Proteja contra:

* SQL Injection;
* Command Injection;
* NoSQL Injection;
* LDAP Injection;
* Template Injection;
* Path Traversal.

---

## 17. Upload de arquivos

Uploads devem possuir validação de:

* tamanho;
* extensão;
* MIME type;
* nome;
* conteúdo quando necessário.

Não confiar no nome original fornecido pelo usuário.

Evite armazenar arquivos enviados diretamente em diretórios públicos sem validação.

Nunca permitir que upload controle livremente o caminho final do arquivo.

---

## 18. Autenticação

Credenciais de autenticação devem ser transmitidas apenas por canais seguros.

Não enviar:

* senha em query string;
* token em URL;
* secret em parâmetro visível.

Tokens devem possuir expiração apropriada.

Sessões devem utilizar mecanismos seguros suportados pela plataforma.

---

## 19. Autorização

Autenticação não substitui autorização.

Toda operação protegida deve validar se o usuário possui permissão para:

```text
ler
criar
alterar
excluir
executar
```

Nunca confiar em identificadores enviados pelo cliente sem verificar propriedade ou permissão.

---

## 20. Criptografia

Não desenvolver algoritmos criptográficos próprios.

Utilize bibliotecas consolidadas e APIs oficiais.

Não utilizar criptografia obsoleta.

Chaves criptográficas devem ser armazenadas separadamente dos dados criptografados sempre que possível.

---

## 21. Comunicação

Em produção, serviços devem utilizar comunicação segura quando suportada.

Prefira:

```text
HTTPS
TLS
SSH
```

Evite protocolos sem criptografia para transmissão de informações sensíveis.

---

## 22. Dependências

Antes de adicionar dependências:

* verifique necessidade;
* avalie manutenção;
* avalie vulnerabilidades conhecidas;
* utilize versões suportadas;
* evite dependências abandonadas.

Não atualizar versões de forma aleatória sem avaliar compatibilidade.

---

## 23. Testes

Nunca utilizar credenciais reais em testes.

Utilize:

* usuários fictícios;
* secrets fictícios;
* tokens inválidos;
* dados sintéticos.

Fixtures e seeds não devem conter dados reais de produção.

---

## 24. CI/CD

Secrets de CI/CD devem utilizar o mecanismo seguro da plataforma.

Nunca imprimir secrets durante pipelines.

Evite comandos de debug que exibam todas as variáveis do ambiente.

Não armazenar secrets diretamente em:

```text
pipeline.yml
workflow.yml
Dockerfile
scripts
```

---

## 25. Docker e containers

Nunca inserir secrets diretamente no:

```text
Dockerfile
docker-compose.yml
compose.yaml
```

quando esses arquivos forem versionados.

Não utilizar:

```text
ENV PASSWORD=senha
```

com valor real.

Secrets devem ser injetados em tempo de execução.

---

## 26. Configuração de produção

Produção deve possuir comportamento seguro por padrão.

Evite em produção:

```text
debug habilitado
stack traces públicos
logs excessivamente verbosos
credenciais padrão
contas administrativas compartilhadas
```

---

## 27. Rotação de credenciais

Credenciais devem ser substituíveis sem alteração do código.

Nunca estruturar a aplicação de forma que a troca de uma senha ou chave exija novo código-fonte.

Preferir:

```text
alterar configuração
→ reiniciar/recarregar aplicação
→ nova credencial utilizada
```

---

# Quando Encontrar Um Secret Exposto

Se durante uma tarefa for identificado um secret real no código:

1. Não reutilize o valor.
2. Não copie o valor para novos arquivos.
3. Não exponha o valor em respostas.
4. Substitua sua utilização por configuração externa quando estiver no escopo.
5. Utilize um placeholder seguro na documentação.
6. Considere a credencial comprometida.
7. Recomende rotação ou revogação da credencial.

Remover o secret do código atual não garante que ele deixou de existir no histórico do repositório.

---

# O Que Não Fazer

Não:

* adicionar senha diretamente no código;
* versionar `.env` real;
* adicionar tokens ao Git;
* adicionar API keys ao código;
* adicionar credenciais em Dockerfile;
* registrar secrets em logs;
* enviar tokens em URLs;
* armazenar senha em texto puro;
* utilizar MD5 ou SHA simples para senhas;
* expor stack traces;
* retornar dados internos desnecessários;
* utilizar usuários administrativos na aplicação;
* utilizar credenciais compartilhadas sem necessidade;
* criar criptografia própria;
* desabilitar validações para facilitar desenvolvimento;
* colocar dados reais de produção em testes;
* copiar secrets encontrados no projeto;
* expor connection strings;
* liberar permissões excessivas;
* imprimir todas as variáveis de ambiente em logs;
* ignorar um secret encontrado apenas porque já estava versionado.

---

# Critérios de Aceite

Uma alteração somente deve ser considerada segura quando os critérios aplicáveis forem atendidos.

## Secrets e credenciais

* [ ] Não existem novos secrets hardcoded.
* [ ] Credenciais são carregadas por configuração externa.
* [ ] Valores reais não foram adicionados à documentação.
* [ ] `.env` contendo secrets não está versionado.
* [ ] Arquivos de exemplo possuem apenas placeholders.
* [ ] Secrets podem ser rotacionados sem alterar o código.

## Banco de Dados

* [ ] Credenciais não estão diretamente no código.
* [ ] Usuário da aplicação possui apenas permissões necessárias.
* [ ] Connection strings sensíveis não são registradas.
* [ ] Queries utilizam mecanismos seguros e parametrizados.

## Logs

* [ ] Senhas não aparecem nos logs.
* [ ] Tokens não aparecem nos logs.
* [ ] Cookies de sessão não aparecem nos logs.
* [ ] Payloads sensíveis são filtrados ou mascarados.
* [ ] Mensagens de erro não revelam informações internas desnecessárias.

## APIs

* [ ] Campos sensíveis não são retornados.
* [ ] Entrada externa é validada.
* [ ] Autorização é verificada no backend.
* [ ] Tokens não são enviados em URLs.
* [ ] Respostas de erro são seguras.

## Autenticação

* [ ] Senhas não são armazenadas em texto puro.
* [ ] Hash de senha utiliza mecanismo adequado.
* [ ] Tokens possuem tratamento seguro.
* [ ] Credenciais não são transmitidas de forma insegura.

## Arquivos

* [ ] Uploads são validados.
* [ ] Caminhos não podem ser manipulados pelo usuário.
* [ ] Arquivos privados não ficam publicamente acessíveis sem necessidade.

## CI/CD e infraestrutura

* [ ] Secrets utilizam mecanismo seguro da plataforma.
* [ ] Pipeline não imprime secrets.
* [ ] Containers não possuem credenciais embutidas.
* [ ] Configuração de produção não expõe debug ou stack trace.

## Testes

* [ ] Testes não utilizam credenciais reais.
* [ ] Fixtures não possuem dados reais sensíveis.
* [ ] Seeds utilizam dados fictícios quando possível.

---

# Fluxo de Verificação

Sempre que criar ou alterar código relacionado a segurança:

```text
1. identificar entradas externas
2. identificar dados sensíveis
3. identificar secrets e credenciais
4. verificar armazenamento
5. verificar transmissão
6. verificar logs
7. verificar respostas de API
8. verificar autorização
9. verificar permissões
10. verificar critérios de aceite
```

---

# Regra Principal

Sempre considere:

```text
código pode ser público
logs podem ser acessados
erros podem ser observados
repositórios podem vazar
```

Portanto:

```text
segredos devem permanecer fora do código
dados sensíveis devem possuir exposição mínima
permissões devem ser mínimas
comportamentos inseguros devem falhar de forma segura
```

Quando existir dúvida entre conveniência e segurança, prefira a alternativa segura que preserve o funcionamento da aplicação.
