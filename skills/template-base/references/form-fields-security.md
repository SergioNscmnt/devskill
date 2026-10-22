# Campos, validação e segurança

## Campos e feedback
- Escolher controles nativos e tipos semânticos (`email`, `tel`, `date`, `select`, `textarea`) conforme o dado. Usar `autocomplete` padronizado quando aplicável; não preencher dados pessoais fictícios.
- Associar `label` ao controle, ajuda e erro por `aria-describedby`; usar `aria-invalid="true"` no erro. Informar obrigatoriedade em texto e atributo quando de fato exigida.
- Validar inline depois de blur ou de interação suficiente; não interromper a digitação com erro prematuro. Na submissão, resumir erros quando útil e mover o foco para o primeiro campo inválido ou resumo com links. Não depender só de cor.
- Validação no cliente melhora a experiência; o servidor deve repetir regras, verificar permissões, normalizar entradas e devolver erros por campo e gerais sem revelar detalhes internos.

## Dados brasileiros, quando aplicáveis
- Máscaras de CPF/CNPJ, CEP e telefone ajudam leitura e entrada; aceitar colagem, remoção e teclado móvel. Persistir formato normalizado esperado pela API.
- Validar dígitos verificadores de CPF/CNPJ no servidor quando esses documentos forem exigidos. CEP pode pedir consulta/autopreenchimento, mas manter edição manual e tratar ausência, erro e divergência de endereço.
- Não coletar CPF/CNPJ por padrão: solicitar somente quando o fluxo e a finalidade exigirem.

## Uploads e dados sensíveis
- Indicar formatos, tamanho e quantidade aceitos antes da escolha. Mostrar arquivo selecionado, progresso quando real, falha e remoção. Não declarar upload concluído antes de confirmação.
- No servidor, limitar tamanho e tipo, verificar conteúdo além da extensão, renomear com segurança, controlar acesso e armazenamento, e tratar arquivos potencialmente maliciosos conforme a arquitetura.
- Usar transporte seguro, proteção contra CSRF quando aplicável, autorização por ação e objeto, tratamento seguro de logs e retenção mínima dos dados. Não expor segredo, documento ou conteúdo de upload em mensagens de erro ou telemetria.
- Rascunhos com dados sensíveis precisam de persistência e escopo autorizados; evitar armazená-los em `localStorage` sem decisão explícita de segurança do produto.
