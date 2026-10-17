# Checklist de revisão de models

- [ ] Banco/versão/adapter detectados, sem expor segredos
- [ ] Tipos nativos confirmados via DDL/catálogo
- [ ] IDs/códigos com zero à esquerda são strings
- [ ] Decimais/precisão/scale conferidos
- [ ] Data, datetime e fuso corretamente modelados
- [ ] Booleans e NULL funcionam no adapter usado
- [ ] Validates + NOT NULL/UNIQUE/FK/CHECK coerentes
- [ ] Associações e dependent/optional alinhados ao negócio
- [ ] PK/FK e índices compatíveis
- [ ] Migrations seguras, backfill e rollback planejados
- [ ] Testes negativos e round-trip executados
- [ ] Bancos não testados explicitamente indicados
