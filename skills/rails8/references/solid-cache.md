# Solid Cache

- Confirmar presença de `solid_cache`, `config/cache.yml`, `config.cache_store` e conexão de banco antes de assumir habilitação.
- Rails 8 novo normalmente inclui Solid Cache, mas projetos migrados/customizados podem não incluir.
- Usar `Rails.cache.fetch` com `expires_in`/versionamento adequados.
- Cache acelera leitura, **não** substitui a fonte de dados ou uma restrição de autorização.
- Evitar cachear dados por usuário sem incluir identidade/tenant/permissões na chave e sem política de invalidação.
- Avaliar tamanho, serialização, retenção e custo no banco; não cachear informações sensíveis indevidamente.
- Invalidação por mudança de versão de objeto (`cache_key_with_version`) pode ajudar; checar se relações dependentes também invalidam.
- Nunca depender de TTL para fazer cumprir revogação imediata de permissão.
- Em produção, confirmar preparação do banco de cache, ciclo de limpeza, monitoramento e backups conforme política.

```ruby
def summary_for(account)
  Rails.cache.fetch(["accounts", account.id, account.updated_at.to_i, "summary"], expires_in: 15.minutes) do
    account.projects.count
  end
end
```
Esse exemplo só é válido se mudanças nos projetos atualizarem a chave ou se o domínio tolerar dados defasados pelo TTL; senão, implementar invalidação explícita.

Referências:
- https://guides.rubyonrails.org/caching_with_rails.html
- https://github.com/rails/solid_cache
