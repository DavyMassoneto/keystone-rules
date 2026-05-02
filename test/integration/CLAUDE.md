# test/integration/

Testes de integração executando o CLI via spawn.

## Helper runCli

`test/integration/cli/_helpers/run-cli.js` encapsula o spawn. Único arquivo do projeto autorizado a usar deep relative para acessar `src/cli.js` (boundary necessário). Outros testes importam `runCli` via path relativo curto.

## Assinatura

```javascript
const { stdout, stderr, exitCode } = await runCli(args, { env, timeout });
```

`args` é array de strings (sem `node` nem path do script). `env` opcional, mesclado com `process.env`. `timeout` opcional (default 10s).

## Variáveis de ambiente para teste

`KEYSTONE_CLAUDE_HOME`: sobrescreve `~/.claude/` para isolamento. Usar `os.tmpdir()` + cleanup em `afterEach` para integration tests que precisam de filesystem real.

## Sem asserções sobre comportamento de Claude Code real

Mocks de `claude` CLI quando necessário (ex.: testes de `auth-check`). Integration tests que dependem do binário real de Claude Code são EVITADOS — não há garantia de que esteja instalado no CI.
