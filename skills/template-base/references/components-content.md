# Componentes, conteúdo e estados

## Navbar
Identidade da aplicação, workspace opcional, busca ou command palette real quando disponível, perfil do usuário e logout vinculado ao fluxo autenticado. Evitar dados fixos de identidade.

## Sidebar
Seções sugeridas no material de origem: Visão Geral, Gestão & Ferramentas, Sistema. Ajustar ao produto; incluir links válidos, indicador ativo e, se relevante, badge LIVE. Atalhos no rodapé são opcionais.

## Main
Breadcrumb e título, ações globais/contextuais, cards explicativos mostrando mapa de landmarks e `data-*`, grid de métricas e status. Não impor cards didáticos a dashboard final se forem irrelevantes.

## Footer
Versão/build, ambiente/região, uptime e links são exemplos de categorias — não valores fixos. Usar dados reais disponíveis; caso contrário, omitir ou marcar “Exemplo” explicitamente.

## Estados necessários
Loading, vazio, erro, indisponibilidade da busca, usuário sem acesso, viewport estreita. Nunca simular sucesso de logout/telemetria sem integração.
