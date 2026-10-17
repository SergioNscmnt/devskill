---
name: template-base
description: >-
  Criar ou adaptar dashboards administrativos responsivos com navbar, sidebar,
  conteúdo principal e footer semânticos. Use quando o usuário solicitar layouts
  de painel, estrutura visual de aplicação, navegação, métricas ou componentes
  de dashboard acessíveis.
---

# Template Base — Dashboard

## Objetivo
Criar uma estrutura de dashboard consistente, responsiva, acessível e adaptável à stack existente, com quatro regiões: navbar, sidebar, conteúdo principal e footer. Os dados e rótulos devem refletir o produto e as instruções do usuário.

## Regras
- Inspecionar framework, componentes, tokens e padrões existentes antes de implementar; reutilizar antes de criar.
- Empregar HTML semântico: `header`, `aside`, `nav`, `main` e `footer`; evitar landmarks redundantes e usar IDs e nomes acessíveis quando necessários.
- Manter hooks `data-component` e `data-action` estáveis para inspeção e testes, sem tratá-los como substitutos de eventos ou autorização.
- Implementar navegação por teclado, indicação de foco, estados ativo/expandido, contraste e comportamento responsivo.
- Não inventar valores de telemetria, usuários reais, ambiente, versão, build ou uptime. Dados demonstrativos devem ser rotulados explicitamente.
- Não implementar logout real, troca de workspace, busca ou atalhos sem integração funcional existente; exibir um estado demonstrativo claramente identificado quando solicitado.
- Priorizar componentes leves, estilos reutilizáveis e dependências já presentes no projeto.

## Estrutura obrigatória
1. **Navbar:** `<header data-component="navbar">` com identidade, seletor de workspace quando pertinente, busca global e cluster `data-component="user-info"` com avatar, nome, função e botão `data-action="logout"`.
2. **Sidebar:** `<aside data-component="sidebar">` com `<nav aria-label="Navegação principal" data-component="menu-list">`; seções *Visão Geral*, *Gestão & Ferramentas* e *Sistema* quando fizerem sentido; link ativo, badges significativos, atalhos e recolhimento acessível.
3. **Principal:** `<main id="main-content" data-component="app-content">` com breadcrumb quando necessário, título, ações, cards explicativos dos landmarks/hooks e grid de métricas/status quando solicitado.
4. **Footer:** `<footer data-component="footer">` com versão/build, ambiente/status e links institucionais/documentação **apenas quando houver dados confiáveis** ou placeholders demonstrativos.

## Fluxo de execução
1. Identificar stack, design system, rotas, dados e requisitos.
2. Consultar apenas as referências pertinentes.
3. Montar a estrutura e implementar os estados interativos reais (ou placeholders explícitos).
4. Validar semântica, teclado, responsividade, overflow, estados vazios/erro/loading e ausência de dados fictícios apresentados como reais.
5. Executar os testes disponíveis e relatar o que foi verificado.

## Restrições
- Não fixar nome de pessoa, cargo, região, versão, build ou percentual de uptime de exemplo como dado real.
- Não adicionar `role="banner"`, `role="main"` ou `role="contentinfo"` a landmarks HTML equivalentes sem necessidade.
- Não criar botões aparentemente funcionais sem ação definida ou sem identificação de protótipo.
- Não quebrar a hierarquia de títulos, a navegação assistiva ou componentes já existentes.

## Critérios de aceite
- Quatro regiões identificáveis e responsivas, sem sobreposição em telas pequenas.
- Sidebar recolhível (quando implementada) com teclado e estado acessível.
- Links, busca, menu e logout com funcionamento real ou identificação clara de demonstração.
- Padrões de foco, labels e contraste revisados.
- Métricas com origem verificável ou sinalizadas como exemplo.
- Testes relevantes executados ou limitações informadas.

## Referências sob demanda
- [Estrutura e hooks](references/layout-semantics.md)
- [Acessibilidade e responsividade](references/accessibility-responsive.md)
- [Componentes, conteúdo e estados](references/components-content.md)

## Scripts
- `python3 scripts/validate_skill.py`: verifica a estrutura da skill e os links internos.
- `python3 scripts/check_dashboard.py CAMINHO_DO_HTML`: heurística estática sobre landmarks e hooks; não substitui testes no navegador.

## Assets
- [Esqueleto HTML](assets/templates/dashboard-shell.html)
- [Checklist de entrega](assets/templates/review-checklist.md)
