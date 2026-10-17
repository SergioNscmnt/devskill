# Acessibilidade e responsividade

- Garantir tabulação lógica, foco visível, rótulos de ícones (`aria-label` em controles), contraste e alvos interativos adequados.
- Toggle da sidebar: `<button aria-controls="sidebar-panel" aria-expanded="false">`; atualizar `aria-expanded` conforme estado real.
- Atalho `Ctrl+K` somente quando a busca/comando existir; não sequestrar o atalho se conflitar com o ambiente; suporte a Escape e gerenciamento de foco.
- Usar `aria-current="page"` no link ativo, não somente cor. Badges como LIVE precisam texto compreensível.
- Avatar decorativo com `alt=""`; se informativo, texto alternativo conciso. Não depender apenas do avatar para identificação.
- Para alterações dinâmicas de status, escolher `aria-live` com parcimônia para não gerar anúncios excessivos.
- Telas estreitas: evitar scroll horizontal do documento, oferecer menu compacto com controle explícito e tabelas com estratégia de overflow local.
- Testar com teclado, zoom 200%, leitor de tela quando possível, largura móvel e desktop; não prometer conformidade WCAG só por checklist.
