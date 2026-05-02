# src/cli/

Pipeline de execução do CLI.

## Estrutura

- `run.js`: função principal `run(argv)`. Recebe array de argumentos (sem `node` e sem path do script). Retorna `Promise<number>` (exit code).
- `route.js`: função `route(parsed, commands)`. Decide qual comando executar baseado em flags de info (`--version`, `--help`) e command name. Flags de info têm prioridade sobre command. `--version` vence `--help` se ambas presentes.
- `handle-error.js`: função `handleError(err)`. Para `KeystoneError`: imprime apenas `err.message` via logger. Para `Error` genérico: imprime via logger com stack. Retorna exit code apropriado.

## Pipeline em run.js

1. Parse argv via `parse` do arg-parser.
2. Dispatch via `route` para o comando correto, ou para `handleError` se comando desconhecido (`UnknownCommandError`).
3. Aguarda execução do comando, retorna exit code.
4. Try/catch envolve tudo — qualquer throw vai para `handleError`.

## Sem flags próprias do CLI

Flags `--version`, `--help`, `-v`, `-h` são tratadas pelo router e roteadas para os comandos correspondentes. Flags de comandos individuais ficam no `parsed.flags` e os comandos consultam diretamente.

## Async em run

`run` é sempre async, retorna Promise. Mesmo comandos síncronos passam pelo `await`. Comandos futuros (install, etc.) serão async — padronizado desde já.
