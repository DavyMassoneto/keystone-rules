# keystone-rules

> ⚠️ **AVISO** — Este pacote é altamente opinativo e foi feito para uso pessoal de Davy Massoneto. Ele modifica seu ambiente de configuração de agentes LLM (a princípio Claude Code) e pode sobrescrever arquivos existentes. Backups automáticos são criados, mas leia este README inteiro antes de instalar.

Pacote de configuração opinativa para agentes LLM de codificação. Distribui skills, hooks, rules, settings e CLAUDE.md através de um único CLI instalável globalmente.

## Status

🚧 **Em desenvolvimento ativo.** CLI funcional para os comandos `version`, `help` e `doctor`. O pacote já distribui o primeiro sistema comportamental (`reasoning-discipline`); os comandos de instalação/atualização ainda virão em fases futuras.

## Instalação

```bash
npm install -g keystone-rules
```

Após instalação, o comando `ks` ficará disponível.

## Pré-requisitos

- Node.js 24 ou superior
- Claude Code instalado e autenticado (verifique com `claude auth status`)

## Uso

### Versão

```bash
ks version       # imprime "keystone-rules <versão>"
ks --version     # equivalente
ks -v            # equivalente
```

### Ajuda

```bash
ks help          # lista comandos disponíveis
ks --help        # equivalente
ks -h            # equivalente
ks               # sem argumentos imprime a ajuda
```

### Diagnóstico de instalação

```bash
ks doctor        # saída humana, uma linha por verificação com ícone + status
ks doctor --json # saída JSON estruturada para automação
```

Verificações executadas:

- **Node.js version**: confere se a versão atende `>=24`.
- **Claude Code installed**: roda `claude --version` com timeout de 5 segundos.
- **Claude Code authenticated**: roda `claude auth status` (skipped quando o passo anterior falha).
- **Claude Code home directory**: confirma que `~/.claude/` (ou `KEYSTONE_CLAUDE_HOME`) existe.
- **keystone-rules manifest**: estado do manifest de instalação (skipped até o comando `install` chegar).
- **Manifest JSON validity**: validade do JSON do manifest (skipped até o comando `install`).
- **Manifest files on disk**: confere se cada arquivo do manifest está presente (skipped até o comando `install`).
- **Claude Code settings.json**: validade do JSON de settings; ausência do arquivo é considerada estado válido (defaults do Claude Code).
- **Hook executability**: bit de executável dos hooks instalados (skipped até o comando `install`).

**Exit code:** `0` quando todas as verificações são `ok`/`warn`/`skipped`; `1` quando qualquer verificação resulta em `error`.

**Variável de ambiente `KEYSTONE_CLAUDE_HOME`:** se setada, sobrescreve `~/.claude/`. Útil para testes e ambientes isolados.

### Hooks comportamentais

O pacote distribui sistemas de hook comportamentais a serem instalados pelo comando `install` (fase futura). Atualmente incluído:

- `reasoning-discipline`: sistema de dois hooks que impõe raciocínio disciplinado sob pressão do usuário. O hook de detecção (`UserPromptSubmit`) sinaliza linguagem de pressão no prompt e injeta um lembrete; o hook de auditoria (`Stop`) inspeciona a resposta da LLM e força continuação com feedback quando a resposta exibe padrões sycophantic.

Esses hooks ficam instaláveis quando o comando `install` for implementado.

## Plataformas suportadas

- Linux
- macOS
- Windows (sem necessidade de WSL)

## Licença

MIT © Davy Massoneto

## Contribuindo

Issues sobre infraestrutura do CLI são bem-vindas. PRs adicionando skills/hooks pessoais não serão aceitos — o pacote distribui configuração pessoal.

### Implementações pendentes

Tests marcados como `it.todo` aguardando comandos de fases futuras (principalmente `install`) estão catalogados em [`docs/PENDING.md`](docs/PENDING.md). Cada entrada referencia o arquivo de teste e o comportamento que será habilitado quando o comando dependente for implementado.
