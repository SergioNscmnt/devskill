# Tipos Rails — matriz de decisão (verificar adapter)

| Domínio | Rails | PostgreSQL | MariaDB | Oracle |
| --- | --- | --- | --- | --- |
| Texto curto limitado | `string, limit: n` | `varchar(n)` | `varchar(n)` | `VARCHAR2(n CHAR/BYTE)` conforme adapter/NLS |
| Texto longo | `text` | `text` | `TEXT`/`LONGTEXT` conforme limit | `CLOB` normalmente |
| Inteiro 32-bit | `integer` | `integer` | `INT` | `NUMBER` com precisão adapter-dependente |
| Inteiro amplo | `bigint` | `bigint` | `BIGINT` | `NUMBER`/equivalente adapter |
| Dinheiro | `decimal, precision: p, scale: s` | `numeric(p,s)` | `decimal(p,s)` | `NUMBER(p,s)` |
| Medida aproximada | `float` | `double precision`/`real` adapter | `DOUBLE`/`FLOAT` adapter | `BINARY_DOUBLE`/`FLOAT` adapter |
| Booleano | `boolean` | `boolean` | `TINYINT(1)` convenção | `NUMBER(1)` historicamente; verificar Oracle 23c+ e adapter |
| Dia civil | `date` | `date` | `DATE` | `DATE` (contém horário; sem timezone) |
| Instante | `datetime` | `timestamp` padrão, configurável `timestamptz` | `DATETIME` | `TIMESTAMP`/`DATE` conforme adapter |
| Dados estruturados | `json` / adapter | `jsonb` recomendado quando consultas/índices | `JSON` alias LONGTEXT + validação | JSON nativo em versões recentes; anterior CLOB + IS JSON |
| Binário | `binary` | `bytea` | `BLOB`/`LONGBLOB` | `BLOB` |
| Identificador único | `uuid` ou `string` | UUID nativo | `CHAR(36)` ou `BINARY(16)` sob contrato | RAW(16) ou VARCHAR2 com conversão customizada |

**A tabela não garante** que uma migration universal produza os tipos exatos. Observar `schema_dump`, consultas ao catálogo e versionamento de adapters. `integer` não deve guardar valores acima de seu intervalo real; códigos documentais são strings. Escolher precisão monetária com domínio (`decimal(18,2)` é exemplo, não universal).

## Invariantes
- `null: false` protege NULL mas não string vazia ou whitespace.
- Defaults devem ser intencionais; não definir zero/falso indiscriminadamente.
- Índices para FKs e filtros frequentes, `UNIQUE` para unicidade; medir seletividade e custo de escrita.
- `enum` em Rails não substitui CHECK/constraint se estados inválidos não podem entrar no banco.
- `:references` só é portátil quando o adapter suporta tipo e FK desejados.
- `:primary_key` e sequência/identity precisam de plano em tabela legada.
