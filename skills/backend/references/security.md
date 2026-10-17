# Seguranca de aplicacoes backend

## Obrigatorio ao tocar codigo sensivel
- Validar dados no servidor: tipo, tamanho, formato, allowlist e regras de dominio.
- Autenticar e autorizar cada operacao e recurso; previna IDOR/BOLA e escalacao de privilegios.
- Usar queries parametrizadas/ORM com parametros; nunca concatenar entrada em SQL.
- Nao interpolar entrada nao confiavel em shell, caminhos de arquivos ou URLs sem protecao contextual.
- Proteger contra SSRF, path traversal, upload malicioso, desserializacao insegura e injection quando aplicavel.
- Credenciais por ambiente/secret manager. Nunca incluir segredos em repositorio, output, excecoes ou logs.
- Restringir permissoes de banco e integracoes ao minimo necessario.
- Usar hashing de senhas apropriado (Argon2id, bcrypt ou equivalente recomendado pela stack), nunca MD5/SHA puro.
- Nao registrar tokens, cabecalhos de autorizacao, senhas, CPF completo ou dados pessoais desnecessarios.
- Definir limites de payload, pagina, timeout, taxa e upload coerentes com risco e infraestrutura.
- Para criptografia, usar bibliotecas e algoritmos atuais da plataforma; nunca implementar criptografia propria.

## Revisao de erros e respostas
- Nao expor stack traces, SQL, caminhos internos ou configuracoes em respostas publicas.
- Mensagens externas devem ser seguras e uteis; logs internos devem ter contexto e redacao de dados sensiveis.
- Evite retornos ambíguos que convertam falha em sucesso silencioso.

## Alteracoes perigosas
- Nao desabilitar autenticacao, verificacao TLS, CSRF ou controles de seguranca para contornar testes.
- Nao executar scripts em producao, migrar dados, extrair segredos ou contatar servicos externos sem autorizacao e escopo claros.
- Se houver suspeita de segredo ja versionado, informe o risco e recomende rotacao e remocao segura do historico por processo apropriado.

## Checks
- Entrada e validacao; autenticacao e autorizacao; injecao; segredos; dados sensiveis; logs; dependencias; erros; controles de acesso.
