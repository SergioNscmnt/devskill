# Oracle Database — Rails 8 (oracle-enhanced)

**Primeiro verificar compatibilidade** entre versões de Rails 8, Ruby, Oracle Database e `activerecord-oracle_enhanced-adapter`. Não prometer compatibilidade não confirmada. Gem e configuração exatas determinam geração de DDL e type casting.

- `VARCHAR2(n CHAR)` para códigos/nome com semântica de caracteres; `VARCHAR2(n BYTE)` pode cortar multibyte. O adapter e `NLS_LENGTH_SEMANTICS` influenciam o DDL.
- `NUMBER(p,0)` para inteiros exatos; `NUMBER(p,s)` para decimais. Checar precisão das colunas existentes e Rails schema dump. `NUMBER(1)` pode ser usado para booleanos 0/1 em esquemas legados com `CHECK (campo IN (0,1))`; conversão automática para `true/false` **depende do adapter/configuração**, não presumir.
- Oracle Database 23c/23ai+ possui suporte a tipo `BOOLEAN` SQL; não presumir suporte ou mapeamento automático pelo adapter Rails instalado.
- `DATE` Oracle inclui hora/minuto/segundo; não é equivalente a `date` PostgreSQL. Preferir mapeamento `DATE` para dia civil com truncamento consistente, verificar como adapter lê/grava. `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE` e `TIMESTAMP WITH LOCAL TIME ZONE` têm comportamentos distintos.
- `CLOB` para textos longos, `BLOB` para binários; comparação/pesquisa em CLOB exige funções/estratégia apropriadas, não usar `=` ingênuo.
- JSON: versões antigas usam CLOB/BLOB/VARCHAR2 com `IS JSON`; Oracle 21c+ tem tipo SQL JSON nativo em certos cenários. Confirmar versão/adapter antes de adotar.
- PK legado pode usar sequence + trigger; não criar identity/sequence paralela nem sobrescrever convenções. `self.table_name`, `self.primary_key`, sequence configurada pelo adapter e schemas proprietários exigem inspeção.
- Identificadores Oracle não entre aspas tradicionalmente são uppercased; respeitar nomes existentes e política de case/quoting.
- Oracle não tem equivalência direta de `ON UPDATE CASCADE`; relações, FK e ações `dependent` devem ser explicitadas. DDL realiza implicit commit: `rollback` de migration Rails não garante desfazer DDL aplicado.
- Tipos `RAW(16)` para UUID e mapeamento Ruby dependem do adapter; definir serialização e formato antes de usar.

## Exemplo legado (ilustrativo, não executar sem verificar adapter)
```ruby
class Inventariado < ApplicationRecord
  self.table_name = "INVENTARIADOS"
  self.primary_key = "ID"  # ajustar ao schema efetivo

  belongs_to :processo, foreign_key: "PROCESSO_ID", optional: false
  validates :inventario_ro, inclusion: { in: [true, false] }
end
```
Se `INVENTARIO_RO` for `NUMBER(1)`, um cast explícito/atributo booleano pode ser necessário conforme adapter; sem isso os valores podem chegar como `0`/`1` e a validação acima falhar. Ao incluir coluna em tabela antiga, fazer backfill e aplicar NOT NULL/CHECK apenas na política temporal correta, sem invalidar registros históricos.

## Conversão orientativa SQL legado → Rails
- `VARCHAR2(120 CHAR)` → `string, limit: 120` (confirmar semântica de comprimento).
- `NUMBER(10,0)` → `integer` **somente** se faixa <= integer Rails/adapter; senão `bigint` ou `decimal` apropriado.
- `NUMBER(19,0)` → `bigint` se intervalo real couber e adapter mantiver precisão; senão `decimal`.
- `NUMBER(18,2)` → `decimal, precision: 18, scale: 2`.
- `CLOB` → `text` sujeito ao adapter.
- `DATE` → `date`/`datetime` conforme significado, não apenas DDL.
- `TIMESTAMP(6)` → `datetime` com precisão compatível e política de timezone documentada.

Verificar `ALL_TAB_COLUMNS`, `ALL_CONSTRAINTS`, `ALL_CONS_COLUMNS`, `ALL_INDEXES`, `ALL_SEQUENCES` com permissões adequadas. Evitar imprimir valores de dados pessoais.
