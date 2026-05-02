# Pending implementations

Cada entrada aqui é um `it.todo` num arquivo de teste, marcando comportamento que será habilitado quando o comando dependente for implementado em fase futura. Quando o `it.todo` for convertido para `it` real, remover a entrada correspondente.

## Phase: install command

### test/unit/lib/doctor-output/run-doctor-checks.test.js

- `marks manifest-exists as ok when the manifest file exists (requires install command)`
- `marks manifest-valid as ok when the manifest is valid JSON (requires install command)`
- `marks manifest-valid as error when the manifest is invalid JSON (requires install command)`
- `marks manifest-files as ok when all files in the manifest exist on disk (requires install command)`
- `marks manifest-files as error when a file in the manifest is missing on disk (requires install command)`
- `marks manifest-files as error when a file in the manifest has the wrong hash (requires install command)`
- `marks hooks-executable as ok when all hooks are executable on Unix (requires install command)`
- `marks hooks-executable as error when a hook is not executable on Unix (requires install command)`
- `marks hooks-executable as ok on Windows regardless of permission bits (requires install command)`
