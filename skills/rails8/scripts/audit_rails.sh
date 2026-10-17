#!/usr/bin/env bash
set -uo pipefail
project="${1:-.}"
if [[ ! -d "$project" || ! -f "$project/Gemfile" ]]; then
  echo "ERRO: indique diretório com Gemfile" >&2
  exit 2
fi
cd "$project" || exit 2
failure=0
missing=0
echo "== Ruby / Bundler =="
if command -v ruby >/dev/null 2>&1; then ruby --version; else echo "Ruby indisponível"; missing=1; fi
if ! command -v bundle >/dev/null 2>&1; then
  echo "Bundler indisponível; nenhuma auditoria executada."
  exit 3
fi
echo "== Dependências instaladas =="
if bundle check; then :; else echo "Dependências ausentes"; failure=1; fi
echo "== Brakeman =="
if bundle exec brakeman -q; then
  echo "Brakeman concluiu sem status de erro"
else
  echo "Brakeman falhou ou não está instalado; revisar log"
  failure=1
fi
echo "== bundler-audit =="
if bundle exec bundler-audit check --update; then
  echo "Auditoria concluída sem status de erro"
else
  echo "bundler-audit falhou, encontrou avisos ou base não atualizável"
  failure=1
fi
if [[ "$failure" -ne 0 || "$missing" -ne 0 ]]; then
  echo "RESULTADO: pendências de auditoria. Não interpretar como ausência de vulnerabilidades."
  exit 1
fi
echo "RESULTADO: verificações concluídas; ainda requer revisão de achados e contexto."
