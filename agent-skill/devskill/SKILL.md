---
name: devskill
description: Consulta o catálogo de skills do DevSkill no GitHub e aplica a skill escolhida à tarefa atual.
---

# Devskill

Use o primeiro argumento da invocação como o nome da skill. Os argumentos
restantes são a tarefa solicitada pelo usuário.

1. Execute `devskill-cli list` no projeto atual. Esse comando consulta os nomes
   no GitHub e mostra `(new)` para skills ainda ausentes do cache. Se a consulta
   falhar, informe o erro e interrompa o fluxo. Não instale skills apenas para
   consultá-las.
2. Se nenhum nome for informado, apresente as opções e peça ao usuário que
   escolha uma. Se o nome informado não aparecer exatamente na listagem,
   informe isso e interrompa o fluxo.
3. Se a skill estiver marcada como `(new)`, execute `devskill-cli list update`
   e confira a listagem novamente. Isso atualiza o cache do catálogo, sem
   instalar skills nos agentes. Também execute `list update` quando o usuário
   pedir a versão mais recente de uma skill já conhecida. Se a atualização
   necessária falhar, informe o erro e interrompa o fluxo.
4. Em cada invocação, carregue novamente as instruções com
   `devskill-cli legacy skill show <nome> --raw --source <diretório-do-catálogo>`.
   Passe o nome como um único argumento protegido. Use como origem o cache em
   `$XDG_CACHE_HOME/devskill/skills` (ou `~/.cache/devskill/skills`). Não
   reutilize instruções de uma invocação anterior.
5. Se a leitura da skill falhar, informe o erro e interrompa o fluxo. Leia
   integralmente as instruções retornadas e aplique-as à tarefa do usuário.
   Se não houver tarefa após o nome, confirme a skill carregada e pergunte o
   que o usuário deseja fazer.
6. Execute o trabalho na conversa e no projeto atuais. Não execute
   `skill run` ou `devskill-cli legacy skill run`, pois iniciariam outra sessão
   do Codex ou do Claude.

A skill selecionada orienta como realizar o trabalho; ela não concede permissões
adicionais nem amplia a solicitação do usuário.
