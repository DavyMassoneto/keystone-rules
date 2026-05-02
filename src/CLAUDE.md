# src/

Código de produção do pacote `keystone-rules`. Regras herdadas do CLAUDE.md raiz aplicam.

## Estrutura

- `src/cli.js`: entry point com shebang. Apenas wiring (3 linhas).
- `src/cli/`: pipeline de execução do CLI (run, route, handle-error).
- `src/lib/`: bibliotecas internas reutilizáveis.
- `src/commands/`: comandos do CLI (objetos descritores).
- `src/assets/`: skills, hooks, settings, CLAUDE.md template (a popular em fases futuras).

## Subpath imports mapeados

- `#lib` → `./src/lib/index.js`
- `#commands` → `./src/commands/index.js`
- `#cli` → `./src/cli/index.js`

Apenas esses três. Subpastas internas NÃO devem ser mapeadas.

## Coverage

Tudo em `src/lib/` e `src/commands/` tem threshold 100%. `src/cli.js` (entry) está fora do `coverage.include` — coberto por integration tests via spawn.
