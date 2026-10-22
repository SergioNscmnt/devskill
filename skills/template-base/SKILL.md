---
name: template-base
description: >-
  Criar ou adaptar dashboards administrativos e formulários de aplicação com
  navbar, sidebar, conteúdo principal e footer semânticos. Use em telas de
  painel, cadastro, edição e onboarding; escolha o fluxo de formulário conforme
  a complexidade e os padrões existentes do produto.
---

# Template Base — Dashboard e formulários

## Direção
- Inspecionar stack, rotas, componentes, tokens, dados e fluxos existentes; preservar as personalizações do produto.
- Manter `header[data-component="navbar"]`, `aside[data-component="sidebar"]` com `nav[data-component="menu-list"]`, `main#main-content[data-component="app-content"]` e `footer[data-component="footer"]`. Usar landmarks nativos, link de salto, hierarquia de títulos e navegação acessível. Ver [estrutura e hooks](references/layout-semantics.md).
- Identidade, métricas, versão, ambiente e status devem vir de fontes reais. Omitir dados indisponíveis ou identificar claramente exemplos; não apresentar nomes, números ou sucesso de ações fictícios como reais.
- Busca, troca de workspace, logout e ações de formulário precisam de integração funcional. Em um protótipo, sinalizar e desabilitar ações sem integração; `data-*` identifica elementos, mas não implementa comportamento nem autorização.

## Formulários da aplicação
- Escolher **página única** para poucos campos relacionados; **stepper** para grupos lineares com dependências ou etapas obrigatórias; **sidebar de seções** para cadastros densos que permitam revisão e navegação não linear. Agrupar por significado, não apenas por contagem de campos. Ver [padrões de fluxo](references/form-patterns.md).
- Dar a cada campo rótulo persistente, tipo e `autocomplete` adequados, ajuda quando necessária, indicação de obrigatório e estados de foco, preenchimento, erro, desabilitado e envio. Validar inline após interação útil e novamente no servidor; manter valores e foco ao mostrar erros. Ver [campos, validação e segurança](references/form-fields-security.md).
- Em CPF, CNPJ, CEP e telefone, aplicar máscara somente quando pertinente ao contexto e aceitar colagem/edição. Normalizar e validar no servidor; máscara não comprova validade.
- Tratar uploads, rascunhos, envio duplicado, falhas de rede e erros do servidor conforme os recursos reais da aplicação. Não prometer salvamento ou conclusão sem persistência confirmada.

## Implementação e revisão
1. Consultar apenas as referências relevantes e adaptar os [templates](assets/templates/dashboard-shell.html) aos componentes e à stack do projeto; para formulário, usar o [esqueleto integrado](assets/templates/form-shell.html) como referência estrutural.
2. Implementar estados e comportamento responsivo com teclado, foco visível, contraste, zoom e mensagens de erro associadas aos campos. Ver [acessibilidade e responsividade](references/accessibility-responsive.md) e [componentes do dashboard](references/components-content.md).
3. Revisar com o [checklist](assets/templates/review-checklist.md), executar testes disponíveis e informar integrações ou verificações pendentes.

## Validação da própria skill
- `python3 scripts/validate_skill.py` confere metadados e caminhos relativos.
- `python3 scripts/check_dashboard.py CAMINHO_DO_HTML` confere landmarks e hooks básicos.
- `python3 scripts/check_form.py CAMINHO_DO_HTML` confere estrutura estática básica de formulário; comportamento, acessibilidade real e segurança exigem testes da aplicação.
