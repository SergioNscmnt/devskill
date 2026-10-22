# Padrões de fluxo de formulário

## Escolha da estrutura
- **Página única:** poucos campos relacionados e revisão simples. Exibir grupos com títulos quando necessário; evitar etapas artificiais.
- **Stepper:** grupos lineares, decisões dependentes ou fluxo obrigatório. Nomear etapas e progresso em texto, permitir voltar sem perder dados e validar o grupo antes de avançar. Não usar percentual calculado por campos preenchidos se não corresponder ao progresso real.
- **Sidebar de seções:** cadastro extenso e revisável em ordem livre. Diferenciar navegação de seções da sidebar global do dashboard; indicar seção atual, incompleta e com erro por texto/ícone, não só cor.

Escolher com base em dependências, extensão, possibilidade de pausa e necessidade de revisão. Evitar mudar a navegação estabelecida do produto sem motivo.

## Ações e estados
- Colocar ação principal com nome específico (`Criar conta`, `Salvar alterações`); `Voltar`, `Cancelar` e `Salvar rascunho` somente quando fizerem sentido e estiverem implementados.
- Durante envio, impedir duplicidade sem apagar valores. Confirmar sucesso apenas depois da resposta do servidor; mostrar falha recuperável e caminho para tentar novamente.
- Se houver rascunho, informar quando foi salvo e como retomá-lo; considerar expiração, conflitos entre sessões e campos sensíveis. Não afirmar salvamento automático sem confirmação.
- Preservar valores ao voltar entre etapas e ao corrigir erros. Ao sair com alterações não salvas, oferecer aviso proporcional ao risco de perda.

## Layout
- Em telas estreitas, uma coluna de campos, rótulos visíveis e ações alcançáveis sem sobreposição. Stepper pode virar lista compacta; sidebar de seções pode virar seletor ou navegação recolhível com estado acessível.
- Reservar espaço para ajuda e mensagens sem deslocar controles de forma brusca. Não usar placeholder como único rótulo.
