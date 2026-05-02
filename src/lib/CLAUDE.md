# src/lib/

Bibliotecas internas reutilizáveis. Funcionalidade pura, sem efeitos colaterais quando possível. Sem dependências externas.

## SRP por pasta

Cada subpasta agrupa funções relacionadas a UMA responsabilidade conceitual:

- `errors/`: hierarquia de erros tipados
- `platform/`: detecção de SO
- `paths/`: resolução de paths derivados
- `arg-parser/`: parser de argv
- `logger/`: saída textual com cores ANSI
- `package-info/`: leitura do package.json
- `auth-check/`: verificações de autenticação do Claude Code
- `claude-invoker/`: spawn de processos `claude`
- `file-ops/`: wrappers minimalistas sobre `node:fs/promises`
- `manifest/`: leitura/escrita do manifest de instalação
- `doctor-checks/`: checks individuais do comando `doctor`
- `doctor-output/`: formatação de saída do comando `doctor`

Cada pasta tem barrel `index.js` que reexporta tudo. Cada arquivo dentro implementa UMA função/classe/constante.

## Erros tipados

Todo erro lançado por código de produção é instância de `KeystoneError` ou subclasse. Nunca lançar `Error` puro. Subclasses adicionam `code` (string SCREAMING_SNAKE) e `exitCode` (number sequencial).

## Imports cross-folder dentro de src/lib/

Quando um arquivo em `src/lib/<a>/` precisa importar de `src/lib/<b>/` (subpasta diferente), usar `import { X } from '#lib/<b>'` — barrel da subpasta destino mapeado no `package.json`. Não usar `'../<b>/index.js'` (caminho relativo cross-folder não é interceptável por `vi.mock` no Vitest 4.x) nem `#lib` (causa ciclo via own-barrel).

Imports same-folder (`./sibling.js`) continuam relativos diretos, conforme regra geral em CLAUDE.md raiz.

## Cross-platform

Funções que dependem de plataforma (path separator, executable bit, spawn de binários) precisam ser testadas com mock de plataforma para garantir coverage 100% em todas as plataformas da matriz CI.
