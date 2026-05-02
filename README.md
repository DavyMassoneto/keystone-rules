# keystone-rules

> ⚠️ **AVISO** — Este pacote é altamente opinativo e foi feito para uso pessoal de Davy Massoneto. Ele modifica seu ambiente de configuração de agentes LLM (a princípio Claude Code) e pode sobrescrever arquivos existentes. Backups automáticos são criados, mas leia este README inteiro antes de instalar.

Pacote de configuração opinativa para agentes LLM de codificação. Distribui skills, hooks, rules, settings e CLAUDE.md através de um único CLI instalável globalmente.

## Status

🚧 **Em desenvolvimento ativo.** Versão `0.0.1` é apenas reserva de nome no registry. CLI ainda não funcional.

## Instalação

```bash
npm install -g keystone-rules
```

Após instalação, o comando `ks` ficará disponível.

## Pré-requisitos

- Node.js 20 ou superior
- Claude Code instalado e autenticado (verifique com `claude auth status`)

## Uso

Documentação completa disponível conforme o pacote evolui. Por enquanto:

```bash
ks --help
```

## Plataformas suportadas

- Linux
- macOS
- Windows (sem necessidade de WSL)

## Licença

MIT © Davy Massoneto

## Contribuindo

Issues sobre infraestrutura do CLI são bem-vindas. PRs adicionando skills/hooks pessoais não serão aceitos — o pacote distribui configuração pessoal.
