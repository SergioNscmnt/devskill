# Estrutura semântica e hooks

- `header[data-component="navbar"]`: marca, contexto/workspace, busca e `data-component="user-info"`.
- `aside[data-component="sidebar"]`: `nav[aria-label="Navegação principal"][data-component="menu-list"]`, seções contextualizadas, estado atual por `aria-current="page"` no link.
- `main#main-content[data-component="app-content"]`: título de nível 1, breadcrumb opcional, ações contextuais, grid de métricas e cards de explicação dos landmarks/hook quando úteis.
- `footer[data-component="footer"]`: versão, ambiente, status, links, sempre com origem dos dados ou identificação de placeholders.
- `data-action="logout"`: apenas hook de identificação; conectar evento/endpoint seguro segundo a stack, ou marcar botão como demonstração.
- Adicionar link de salto para `#main-content` no início do documento.
- Se sidebar conter navegação principal, seu `<nav>` pode ser diretamente descendente de `aside`; não duplicar `nav` sem propósito.
- Evitar `role="list"` em listas HTML nativas, salvo necessidade técnica comprovada.
- Se houver sidebar móvel, distinguir comportamento de drawer (com fechamento, foco, Escape) da sidebar desktop.
