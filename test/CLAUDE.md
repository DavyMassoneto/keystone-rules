# test/

Testes do projeto.

## Estrutura

- `test/unit/`: testes unitários espelhando `src/`. Usa mocks de `node:` modules.
- `test/integration/`: testes que executam o CLI real via spawn. Usa helper `runCli` em `_helpers/`.

## Configuração Vitest

`vitest.config.js` na raiz. `include: ['test/**/*.test.js']`. Coverage 100% para `src/lib/` e `src/commands/`. Sem co-localização em `src/`.

## Padrões obrigatórios

- Um `describe` por arquivo, sem aninhamento.
- Imports via `#lib`/`#commands`/`#cli` (igual produção).
- `vi.mock` posicionado APÓS imports.
- `vi.mock('#lib', ...)` para mockar libs internas. Validado empiricamente que funciona no Vitest 4.x + Node 24.
- Mocks de `node:child_process`, `node:fs/promises` via `vi.mock('node:...', ...)`.
- `it.todo` para casos planejados mas dependentes de funcionalidade futura. Cada `it.todo` registrado em `docs/PENDING.md`.
