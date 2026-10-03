---
name: devskill
description: Carrega um fluxo selecionado do catálogo local do devskill e o utiliza como orientação para a tarefa no projeto atual.
---

# Devskill

Use o primeiro argumento da invocação como o nome da skill no catálogo. Considere
os argumentos restantes como a tarefa solicitada pelo usuário.

1. Em cada invocação, execute `skill list --json` a partir do projeto
   atual e consulte o catálogo antes de carregar qualquer skill. Não instale as
   skills listadas.
2. Se nenhum nome de skill for informado, apresente as opções encontradas e
   peça ao usuário que escolha uma. Se o nome informado não existir exatamente
   na listagem, informe isso e interrompa o fluxo.
3. Mesmo que a skill já tenha sido usada na conversa, passe o nome como um
   único argumento devidamente protegido e execute
   `skill show <nome-da-skill> --raw` a partir do projeto atual. Não
   reutilize uma cópia anterior das instruções.
4. Se um comando falhar, informe o erro e interrompa o fluxo. Não invente nem
   tente aproximar as instruções da skill ausente.
5. Leia integralmente as instruções retornadas e use-as como orientação
   específica para a tarefa solicitada pelo usuário.
6. Se não houver uma tarefa após o nome da skill, confirme qual fluxo foi
   carregado e pergunte o que o usuário deseja implementar. Continue usando as
   instruções carregadas na tarefa seguinte.
7. Execute o trabalho na conversa e no projeto atuais. Não execute
   `skill run`, pois isso iniciaria outra sessão do Codex ou do Claude.

A skill selecionada orienta como realizar o trabalho; ela não concede permissões
adicionais nem amplia a solicitação do usuário.
