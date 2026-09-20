---
name: front-end
description: Use para criar ou aprimorar interfaces responsivas com Tabler.io.
---

# Skill de Front-end — Tabler.io

## Objetivo

Use esta skill para criar, melhorar ou refatorar interfaces web.

Escopo exclusivo de front-end:

* UI/UX
* Layout
* Componentes
* Responsividade
* Interações
* Formulários
* Tabelas
* Dashboards
* Estados da interface
* Acessibilidade
* Refinamento visual

Não implemente backend, banco de dados, regras de negócio, autenticação de servidor ou novos endpoints.

---

## 1. Design System

Use **Tabler.io** como base visual principal.

Referências:

* https://tabler.io/
* https://tabler.io/icons

Prioridade:

1. Componentes já existentes no projeto
2. Componentes do Tabler
3. Componentes customizados

Não recrie componentes que o Tabler já fornece sem necessidade.

Use **Tabler Icons** como biblioteca padrão de ícones.

Não misture bibliotecas visuais ou de ícones sem justificativa.

---

## 2. Direção visual

A interface deve ser:

* Moderna
* Limpa
* Profissional
* Interativa
* Responsiva
* Clara
* Consistente
* Adequada a aplicações SaaS e administrativas

Priorize usabilidade sobre decoração.

Evite:

* Glassmorphism excessivo
* Gradientes desnecessários
* Cores neon
* Sombras fortes
* Títulos gigantes
* Pills em excesso
* Animações decorativas
* Cards para todo conteúdo
* Visual genérico de landing page
* Padrões visuais típicos de UI gerada por IA

Use como referência conceitual a qualidade de produtos como Linear, Stripe, Vercel, GitHub, Supabase e dashboards modernos do Tabler, sem copiá-los.

---

## 3. Layout

Para aplicações complexas, prefira:

```text
App Shell
├── Sidebar
├── Navbar
└── Conteúdo principal
```

Para aplicações simples:

```text
Navbar
└── Conteúdo principal
```

Use sidebar recolhível quando houver muitas áreas.

No mobile, converta a navegação para drawer/offcanvas.

Mantenha conteúdo com padding adequado:

```text
Mobile: 16px
Tablet: 24px
Desktop: 24–32px
```

Evite conteúdo encostado nas bordas da viewport.

---

## 4. Hierarquia visual

Toda tela deve deixar claro:

* Onde o usuário está
* O que está vendo
* Qual é a ação principal
* Quais ações secundárias existem
* O resultado de cada interação

Estrutura típica:

```text
Cabeçalho
Ação principal
Filtros ou contexto
Conteúdo principal
Conteúdo secundário
```

Use apenas uma ação visualmente dominante por contexto.

---

## 5. Tipografia e cores

Use tipografia e cores do Tabler sempre que possível.

Hierarquia recomendada:

```text
Título da página
Título da seção
Título do card
Texto
Texto secundário
Label
Legenda
```

Use cores semanticamente:

```text
Verde → sucesso
Amarelo/Laranja → atenção
Vermelho → erro ou ação destrutiva
Azul → ação principal ou informação
Cinza → neutro ou inativo
```

Prefira bordas sutis a sombras fortes.

---

## 6. Componentes

Use padrões Tabler para:

* Cards
* Forms
* Tables
* Buttons
* Badges
* Dropdowns
* Modals
* Offcanvas
* Tabs
* Breadcrumbs
* Pagination
* Alerts
* Toasts
* Skeletons
* Avatars
* Tooltips
* Progress

Não use cards apenas como decoração.

Não crie componentes customizados quando um componente equivalente já existir.

---

## 7. Botões e ações

Use:

```text
Primary → ação principal
Secondary → ação auxiliar
Danger → ação destrutiva
```

Prefira labels específicos:

```text
Criar projeto
Salvar alterações
Convidar membro
Excluir cliente
```

Evite:

```text
Enviar
Executar
Prosseguir
Confirmar
```

quando for possível descrever melhor a ação.

Botões apenas com ícone devem possuir `aria-label` e, quando necessário, tooltip.

---

## 8. Formulários

Estrutura:

```text
Label
Input
Texto auxiliar ou erro
```

Nunca use placeholder como único label.

Prefira formulários de uma coluna.

Use duas colunas apenas para campos naturalmente relacionados.

Validação deve aparecer próxima ao campo.

Para formulários longos, divida por seções.

Use:

```text
Checkbox → múltiplas opções
Radio → uma opção entre várias
Switch → configuração imediata on/off
```

---

## 9. Tabelas e listagens

Use tabelas Tabler para dados estruturados.

Alinhamento:

```text
Texto → esquerda
Números → direita
Ações → direita
```

Evite muitos botões por linha.

Prefira menu contextual:

```text
⋯
```

Ações destrutivas devem ficar separadas.

Em mobile:

* Oculte colunas secundárias
* Permita scroll horizontal quando necessário
* Converta para cards quando fizer sentido

Não comprima conteúdo até ficar ilegível.

---

## 10. Estados da interface

Considere sempre, quando aplicável:

```text
Inicial
Loading
Sucesso
Vazio
Erro
Desabilitado
```

Nunca implemente apenas o estado de sucesso.

Use:

```text
Skeleton → carregamento de conteúdo
Spinner → ação curta
Progress → processo mensurável
```

Empty state deve conter:

```text
Ícone
Título
Descrição curta
Ação principal
```

Erros devem explicar o problema e oferecer retry quando apropriado.

---

## 11. Feedback

Toda ação relevante deve fornecer feedback.

Use:

* Toast
* Estado atualizado
* Mensagem inline
* Badge
* Loading no botão

Evite modal para informar sucesso comum.

Não exiba sucesso antes da confirmação real da operação.

---

## 12. Interações

Todo componente interativo deve considerar:

```text
Default
Hover
Focus
Active
Disabled
Loading
```

Hover deve ser sutil.

Microinterações devem ser rápidas:

```text
120–250ms
```

Use animações apenas para comunicar mudança de estado.

Respeite:

```css
prefers-reduced-motion
```

---

## 13. Responsividade

A interface deve funcionar em:

```text
Mobile
Tablet
Notebook
Desktop
```

Não apenas reduza o layout desktop.

Em telas menores:

1. Preserve ações principais
2. Preserve informações essenciais
3. Reorganize layouts
4. Recolha navegação
5. Oculte informações secundárias

Targets de toque devem ter aproximadamente 40–44px quando aplicável.

---

## 14. Acessibilidade

Acessibilidade é obrigatória.

Use HTML semântico:

```html
<button>
<nav>
<main>
<header>
<section>
<form>
<label>
<table>
```

Garanta:

* Navegação por teclado
* Focus visível
* Contraste adequado
* Labels em inputs
* `aria-label` em botões de ícone
* Ordem de tabulação previsível

Não simule controles interativos com `div` quando existir elemento HTML apropriado.

---

## 15. Dark mode

Quando necessário, use o suporte do Tabler.

Não apenas inverta branco e preto.

Mantenha diferentes níveis de:

```text
Background
Surface
Elevated surface
Border
Texto principal
Texto secundário
```

---

## 16. CSS

Priorize:

1. Classes do projeto
2. Utilities do Tabler
3. CSS customizado

Evite:

* CSS duplicado
* Seletores excessivamente específicos
* `!important`
* Valores hardcoded quando houver variável do tema

Prefira variáveis Tabler:

```css
.custom-card {
  border-color: var(--tblr-border-color);
}
```

---

## 17. JavaScript e estado

Evite JavaScript quando HTML, CSS ou Tabler já resolverem o comportamento.

Use JavaScript para:

* Filtros
* Busca
* Modais
* Dropdowns
* Toasts
* Tabs
* Charts
* Estados assíncronos

Não introduza gerenciamento complexo de estado para interações simples.

---

## 18. Dados fictícios

Mocks devem parecer reais.

Prefira:

```text
Maria Santos
Acme Tecnologia
R$ 24.850,00
19/09/2026
```

Evite:

```text
Lorem Ipsum
User 1
Test 123
foo@example.com
```

Não transforme mocks em regras de negócio.

---

## 19. Localização pt-BR

Para produtos brasileiros, quando aplicável:

```text
Moeda → R$ 1.250,00
Data → 19/09/2026
Telefone → (69) 99999-9999
CEP → 76800-000
```

Use textos naturais em português:

```text
Salvar alterações
Criar projeto
Excluir
Cancelar
Configurações
Pesquisar
```

---

## 20. Padrões de tela

### Dashboard

```text
Cabeçalho
KPIs
Gráfico principal
Métricas secundárias
Tabela ou atividade recente
```

### Listagem

```text
Cabeçalho
Busca / filtros / ações
Tabela ou lista
Paginação
```

### Detalhes

```text
Identidade
Status
Ações
Informações relacionadas
Tabs quando necessário
```

### Formulário

```text
Título
Descrição
Campos
Validação
Ações
```

### Configurações

```text
Sidebar ou tabs
Área de conteúdo focada
```

### CRUD

```text
Listar → busca + filtros + criar
Criar → formulário
Visualizar → resumo + relacionados
Editar → formulário
Excluir → confirmação explícita
```

---

## 21. Não redesenhar sem necessidade

Ao trabalhar em um projeto existente, preserve:

* Marca
* Navegação
* Componentes
* Layout
* Convenções
* Hábitos dos usuários

Não altere áreas fora do escopo sem solicitação.

---

## 22. Fluxo de trabalho do Codex

Antes de implementar:

1. Inspecione framework, Tabler, componentes, layout, CSS, ícones e telas semelhantes.
2. Identifique o padrão da tela.
3. Liste os estados necessários.
4. Reutilize componentes existentes.
5. Use Tabler antes de criar componentes novos.
6. Implemente.
7. Refine responsividade, espaçamento, estados, hover, focus e acessibilidade.
8. Valide desktop, tablet e mobile.

Não comece criando novos componentes antes de entender o projeto.

---

## 23. Checklist final

Antes de concluir, verifique:

* Tabler usado consistentemente
* Hierarquia visual clara
* Ação principal evidente
* Responsividade funcionando
* Loading tratado
* Empty state tratado
* Erros tratados
* Hover e focus presentes
* Navegação por teclado funcionando
* Formulários com labels
* Ícones Tabler consistentes
* Tabelas utilizáveis em mobile
* Ações destrutivas claras
* CSS customizado apenas quando necessário
* Nenhum controle falso
* Nenhuma mudança de backend
* Nenhum redesign fora do escopo

---

## 24. Prioridade

Quando houver conflito:

```text
1. Usabilidade
2. Correção
3. Acessibilidade
4. Consistência com o projeto
5. Convenções do Tabler
6. Responsividade
7. Refinamento visual
8. Animação
```

Nunca sacrifique usabilidade por estética.

---

## 25. Princípio final

Toda tela deve responder claramente:

```text
Onde estou?
O que estou vendo?
O que posso fazer?
Qual é a ação principal?
O que aconteceu após minha ação?
```

Se alguma resposta não estiver clara, refine a interface.

O resultado deve parecer software moderno de produção, não um protótipo.
