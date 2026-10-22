#!/usr/bin/env python3
"""Checagem heurística de formulário HTML estático; não testa JS nem servidor."""
from html.parser import HTMLParser
from pathlib import Path
import sys


class Inspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.main_depth = 0
        self.form_depth = 0
        self.form_in_main = False
        self.labels = set()
        self.label_depth = 0
        self.controls = []
        self.submit = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.main_depth += 1
        elif tag == "form":
            self.form_depth += 1
            self.form_in_main |= self.main_depth > 0
        if tag == "label":
            self.label_depth += 1
            if attrs.get("for"):
                self.labels.add(attrs["for"])
        if self.form_depth and tag in {"input", "select", "textarea"}:
            if attrs.get("type") not in {"hidden", "submit", "button", "reset"}:
                self.controls.append((tag, attrs.get("id"), attrs.get("name"), self.label_depth > 0))
            if tag == "input" and attrs.get("type") == "submit":
                self.submit = True
        if self.form_depth and tag == "button" and attrs.get("type") == "submit":
            self.submit = True

    def handle_endtag(self, tag):
        if tag == "form":
            self.form_depth = max(0, self.form_depth - 1)
        elif tag == "label":
            self.label_depth = max(0, self.label_depth - 1)
        elif tag == "main":
            self.main_depth = max(0, self.main_depth - 1)


def main():
    if len(sys.argv) != 2:
        sys.exit("Uso: python3 check_form.py arquivo.html")
    path = Path(sys.argv[1])
    if not path.is_file():
        sys.exit("Arquivo não encontrado")
    parser = Inspector()
    parser.feed(path.read_text(encoding="utf-8"))
    errors = []
    if not parser.form_in_main:
        errors.append("formulário dentro de main ausente")
    if not parser.controls:
        errors.append("controles editáveis ausentes")
    for tag, control_id, name, wrapped in parser.controls:
        if not wrapped and (not control_id or control_id not in parser.labels):
            errors.append(f"{tag} {name or control_id or '(sem nome)'} sem label associado")
    if not parser.submit:
        errors.append("botão de envio explícito ausente")
    if errors:
        for error in errors:
            print("ERRO:", error, file=sys.stderr)
        return 1
    print("OK: formulário e rótulos básicos detectados; validar comportamento no navegador e servidor")
    return 0


if __name__ == "__main__":
    sys.exit(main())
