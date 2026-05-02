# test/unit/

Testes unitários. Espelham estrutura de `src/` 1-para-1.

## Granularidade

Cada arquivo em `src/lib/<pasta>/<arquivo>.js` tem teste correspondente em `test/unit/lib/<pasta>/<arquivo>.test.js`.

## Mocks

- `node:fs/promises`, `node:child_process`, `node:os` via `vi.mock` no topo (após imports).
- `#lib` para mockar funções internas via `vi.mock('#lib', async () => { const actual = await vi.importActual('#lib'); return { ...actual, fnAlvo: vi.fn() }; })`.
- `process.platform` via `Object.defineProperty(process, 'platform', { value, configurable: true })` com `afterEach` restaurando.

## Coverage

Threshold 100% aplica. Cada teste cobre TODOS os caminhos da função sob teste, incluindo throws e branches por plataforma.
