# src/

Código de produção do pacote `keystone-rules`. Regras herdadas do CLAUDE.md raiz aplicam.

## Estrutura

- `src/cli.js`: entry point com shebang. Apenas wiring (3 linhas).
- `src/cli/`: pipeline de execução do CLI (run, route, handle-error).
- `src/lib/`: bibliotecas internas reutilizáveis.
- `src/commands/`: comandos do CLI (objetos descritores).
- `src/assets/`: skills, hooks, settings, CLAUDE.md template (a popular em fases futuras).

## Subpath imports mapeados

Três barrels de alto nível para uso externo:

- `#lib` → `./src/lib/index.js`
- `#commands` → `./src/commands/index.js`
- `#cli` → `./src/cli/index.js`

E uma entrada por subpasta de `src/lib/` para imports cross-folder DENTRO de `src/lib/` (e nos testes que precisam mockar essas funções):

- `#lib/<subpasta>` → `./src/lib/<subpasta>/index.js`

Adicionar nova entrada ao `package.json` sempre que uma subpasta de `src/lib/` for criada. Cada barrel de subpasta corresponde 1-para-1 ao seu mapeamento.

Imports externos a `src/lib/` (em `src/cli/`, `src/commands/`, testes gerais) usam apenas `#lib`. As entradas `#lib/<subpasta>` existem para resolver o problema específico de mock cross-folder dentro de `src/lib/` (ver CLAUDE.md raiz, seção "Imports e barrels").

## Coverage

Tudo em `src/lib/` e `src/commands/` tem threshold 100%. `src/cli.js` (entry) está fora do `coverage.include` — coberto por integration tests via spawn.
