# test/unit/

Testes unitários. Espelham estrutura de `src/` 1-para-1.

## Granularidade

Cada arquivo em `src/lib/<pasta>/<arquivo>.js` tem teste correspondente em `test/unit/lib/<pasta>/<arquivo>.test.js`.

## Mocks

- `node:fs/promises`, `node:child_process`, `node:os` via `vi.mock` no topo (após imports).
- **`vi.mock` casa o specifier exato que a SOURCE usa.** Para mockar uma função interna:
  - Source que importa de `#lib`: `vi.mock('#lib', async () => { const actual = await vi.importActual('#lib'); return { ...actual, fnAlvo: vi.fn() }; })`.
  - Source que importa de `#lib/<subpasta>` (caso cross-folder dentro de `src/lib/`): `vi.mock('#lib/<subpasta>', async () => { const actual = await vi.importActual('#lib/<subpasta>'); return { ...actual, fnAlvo: vi.fn() }; })`.
- Mock no barrel pai (`#lib`) NÃO se propaga para subpastas re-exportadas — confirmado empiricamente em Vitest 4.x. Sempre alinhar o specifier do `vi.mock` com o `import` do arquivo de produção sob teste.
- `process.platform` via `Object.defineProperty(process, 'platform', { value, configurable: true })` com `afterEach` restaurando.

## Coverage

Threshold 100% aplica. Cada teste cobre TODOS os caminhos da função sob teste, incluindo throws e branches por plataforma.
