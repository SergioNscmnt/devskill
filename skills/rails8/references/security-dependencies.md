# Segurança de aplicações e seleção de gems

## Invariantes
- Autenticação não implica autorização: verificar permissão por ação e registro.
- CSRF para requests de sessão, escaping de views, CSP apropriada, cookies seguros, redirect com hosts permitidos e uploads validados.
- Parametrizar SQL; jamais passar filtros arbitrários para `send`, `constantize`, `order` ou SQL dinâmico.
- Segredos via credentials/ENV/secret manager; jamais no repositório, logs, front-end ou arquivos de exemplo com valores reais.
- `filter_parameters`, logs e tracing devem evitar tokens, senhas e PII. Usar TLS, rate limits e tratamento de erros sem stack trace público.
- Para chamadas externas, validar domínios/destinos e bloquear acesso a redes internas se aplicável (SSRF).
- Identificar escopo de dependências transitivas no `Gemfile.lock`.

## Antes de adicionar gem
1. Confirmar que Rails nativo não atende.
2. Consultar origem oficial/repositório, atividade e releases recentes, número de mantenedores quando acessível, licença e documentação.
3. Verificar compatibilidade de Ruby/Rails e impacto de dependências transitivas.
4. Verificar avisos de segurança atuais (RubySec, GitHub Advisory Database/OSV) e executar scanner no lockfile.
5. Favorecer versões estáveis e constraints compatíveis; commitar `Gemfile.lock` para apps.
6. Recusar gem abandonada, pacote de procedência duvidosa ou vulnerabilidade conhecida sem mitigação expressa.
7. Não prometer “sem vulnerabilidades”: scanners têm cobertura e data de atualização limitadas.

## Ferramentas (se disponíveis)
```bash
bundle exec brakeman -q
bundle exec bundler-audit check --update
bundle exec rails test
```
Alternativamente `bundle audit check --update` quando CLI instalada como `bundle-audit`. `--update` precisa de rede; em ambiente offline, registrar que base pode estar defasada.

- Auditoria do código (Brakeman) != auditoria de dependências (bundler-audit); ambas são necessárias para sinais diferentes.
- Revisar achados e falsos positivos, nunca ignorar indiscriminadamente.
- Atualizações de dependências exigem regressão e leitura de changelog.

Fontes: https://guides.rubyonrails.org/security.html ; https://brakemanscanner.org/ ; https://github.com/rubysec/bundler-audit
