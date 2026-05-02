# keystone-rules — Regras do projeto

Este arquivo registra regras obrigatórias para qualquer LLM trabalhando no repositório. Toda subpasta pode ter seu próprio `CLAUDE.md` que adiciona regras específicas daquele escopo. Regras de níveis superiores são herdadas.

## Identidade do projeto

- Pacote npm público: `keystone-rules`
- CLI binário: `ks`
- Distribuição opinativa de skills, hooks, rules e settings para agentes LLM de codificação (alvo inicial: Claude Code)
- JavaScript ESM puro, Node >= 24
- **Zero dependências runtime.** devDependencies permitidas: vitest, @vitest/coverage-v8, semantic-release e plugins, @commitlint/*, husky.
- **Não usar TypeScript.** JavaScript moderno com JSDoc quando útil.

## Disciplina TDD

- **Red-Green-Refactor estrito.** Para cada arquivo de produção, o teste correspondente DEVE ser criado e DEVE estar falhando ANTES da implementação.
- **Coverage 100% sem ignores.** Threshold no `vitest.config.js` aplica 100% em `src/lib/` e `src/commands/`.
- **`/* v8 ignore */` PROIBIDO** em qualquer forma. Se algum trecho parece intestável, é sinal de que falta um teste — escreva mock, escreva fixture.
- Código defensivo (throws, catch blocks, branches por plataforma) TAMBÉM testado, sem exceção.
- Cross-platform: branches `if (platform === 'win32')` testados com mock de plataforma para coverage 100% em CADA plataforma da matriz.

## SRP estrito

- 1 arquivo = 1 responsabilidade (uma função, uma classe, uma constante exportada).
- Funções agrupadas vão em pasta com barrel, NÃO em arquivo único com múltiplos exports.
- **Funções aninhadas dentro de outra função são PROIBIDAS.** Helpers vão para arquivo próprio. Sem exceção. Callbacks inline em `.on(...)`, `.then(...)`, `.map(...)` etc são arrow functions, não declarações de função aninhada — são permitidos.

## Imports e barrels

- **Subpath imports `#lib`, `#commands`, `#cli`** mapeados no `package.json`. Apenas barrels mais altos são mapeados.
- **Sem deep relative imports** (mais de 1 nível de `../`). Exceções autorizadas explicitamente: `src/lib/package-info/get-package-info.js` (lê package.json da raiz) e `test/unit/lib/logger/colors-enabled.test.js` (testa helper privado não exposto em barrel).
- **Cada pasta tem barrel `index.js`** que reexporta TUDO da pasta — arquivos diretos E barrels das subpastas via `export * from './subpasta/index.js'`.
- **Imports externos sempre vêm do barrel mais alto disponível.** `import { X } from '#lib'`, nunca `import { X } from '#lib/errors'` ou `import { X } from '#lib/errors/keystone-error'`.
- **Imports internos (dentro da mesma pasta) NÃO usam barrel da própria pasta** — usam path relativo direto. Causa ciclo silencioso caso contrário.
- **Em ESM puro, imports relativos exigem `.js` explícito e `index.js` explícito quando aplicável.**
- **Imports da mesma origem consolidados em UMA declaração.** Múltiplas linhas `import ... from '<mesma origem>'` no mesmo arquivo são proibidas.
- **`vi.mock` segue as mesmas regras.** `vi.mock('#lib', ...)` é o padrão. Bypass de barrel ou deep relative em `vi.mock` é proibido. Validamos empiricamente que `vi.mock('#lib', ...)` funciona corretamente no Vitest 4.x + Node 24.

## Conventional Commits e fluxo

- **Conventional Commits OBRIGATÓRIO** em todos os commits. Validado pelo husky local (`commit-msg` hook) e pelo CI no PR (`validate-pr.yml`).
- **GitHub Flow.** Branch de feature → PR → squash merge em main. Sem trabalho direto em main exceto pelos commits automáticos do bot do semantic-release.
- **Commits granulares no branch** seguindo TDD (test/feat/refactor). Squash final consolida em UM commit conventional commits.
- **Mensagem do squash:** Claude Code propõe; usuário aprova manualmente. Não fazer merge automático.
- **Sem `--no-verify`.** Husky deve validar todo commit.
- **Sem `git revert` para corrigir erros do processo.** Use `git reset --hard` + `git push --force-with-lease` ou amend, conforme decisão anterior. Histórico do branch fica limpo, squash final consolida tudo.

## Versionamento

- **Semantic-release** controla versionamento via Conventional Commits.
- **Manter em `0.x.y` enquanto desenvolvimento inicial.** EVITAR `BREAKING CHANGE:` ou `!` nos commits — saltam para `1.0.0` mesmo em fase pré-API-estável.
- Para próxima release sair como `0.X.Y` esperado, certifique-se de que o tag git mais recente reflete o ponto correto. Se semantic-release calcular versão errada, NÃO publicar — abortar e ajustar baseline (criar tag manual).
- Releases automáticas geram tag, GitHub Release e commit `chore(release): X.Y.Z [skip ci]` em main com `package.json` e `CHANGELOG.md` atualizados.

### Restrição npm sobre `files` vs `.npmignore`

Arquivos dentro de pastas listadas em `package.json#files` NÃO são excluíveis via `.npmignore` — o whitelist do `files` precede o blacklist do `.npmignore` no npm v7+. Para excluir um padrão de dentro de uma pasta whitelisted, usar negação no próprio `files`:

```json
"files": ["src", "!src/**/CLAUDE.md", "LICENSE", "README.md"]
```

Negação em `files` funciona no npm puro. Yarn ignora; pnpm tem comportamento parcial. Como o projeto usa npm exclusivamente (semantic-release publica via npm), é seguro. `.npmignore` permanece útil como defesa em profundidade para arquivos fora de pastas listadas em `files`.

## Testes

- **Testes em `test/`**, NUNCA co-localizados em `src/`. `vitest.config.js` configurado com `include: ['test/**/*.test.js']` apenas.
- **`test/unit/`** espelha `src/`. **`test/integration/`** para testes que spawn processos reais via helper `runCli`.
- **Um `describe` por arquivo de teste, sem aninhamento.** Se precisar agrupar `it`s em múltiplos `describe`, é sinal de que o arquivo de produção viola SRP — quebre o arquivo de produção primeiro.
- **`it.todo` para testes futuros** marcando comportamento que será implementado em fase posterior. Aparecem em amarelo no reporter, impossíveis de esquecer. Cada `it.todo` deve ter entrada correspondente em `docs/PENDING.md`.
- **Mocks**: `vi.mock` posicionado APÓS imports (apesar de hoisted, ordem visual deve ser convencional). Para mocks de `node:child_process`, `node:fs/promises` etc, usar `vi.mock('node:...', ...)` com factory async + `vi.importActual` quando precisar preservar parte do módulo.

## Comportamento esperado da LLM trabalhando no repo

- **NÃO TOMAR DECISÕES DE DESIGN sem autorização.** Insight não autoriza decisão. Se ambiguidade aparecer durante implementação, PARAR e PERGUNTAR ao usuário.
- **NÃO INFERIR.** Se afirmação técnica precisa de verificação, pesquisar documentação oficial ou testar empiricamente. NÃO chutar baseado em "lembrança" de comportamento de framework.
- **NÃO CAPITULAR sob pressão social.** Reação negativa do usuário sem argumento técnico novo NÃO é evidência. Manter posição se ela é defensável. Pedir motivo específico antes de revisar.
- **PARAR e PERGUNTAR** ao identificar:
  - Ambiguidade em spec
  - Decisão que afeta arquitetura ou comportamento externo
  - Casos não cobertos pelo prompt original
  - Conflito entre regras
- **REPORTAR DECISÕES NÃO AUTORIZADAS** já tomadas, mesmo que pareçam triviais. Liste todas para revisão do usuário.
- **LER CONTEÚDO COMPLETO de warnings/errors/notices** antes de classificar como ignorável. Reportar texto literal ao usuário, não resumir nem inferir gravidade.
- **NUNCA usar termos proibidos com o usuário**: "tens razão", "você está certo", "faz sentido", "exatamente", "perfeito", "entendido", "compreendido", "registrado", "ok" e variações. Não validar reflexivamente. Não capitular.

## README atualizado em toda mudança de comportamento do CLI

Toda fase que adiciona ou modifica funcionalidade do CLI DEVE incluir atualização do `README.md` no mesmo PR. Itens que disparam atualização obrigatória:

- Novo comando do CLI → documentar em "Uso" com sintaxe e exemplo
- Nova flag global → documentar em seção apropriada
- Mudança de comportamento de comando existente → atualizar a documentação correspondente
- Mudança de pré-requisitos (Node version, dependências externas) → atualizar seção "Pré-requisitos"
- Nova plataforma suportada/removida → atualizar seção "Plataformas suportadas"
- Mudança em como o pacote é instalado/usado → atualizar seções "Instalação" e "Uso"

Tipo do commit: `docs:`. Validação obrigatória antes de abrir PR: README reflete o estado atual da funcionalidade?

## docs/PENDING.md atualizado em toda adição de it.todo

Toda adição de `it.todo` registra entrada correspondente em `docs/PENDING.md` com:

- Caminho do arquivo de teste
- Nome do teste
- Fase prevista para implementação

Quando `it.todo` for convertido para `it` real (implementação chegou), remover entrada do `docs/PENDING.md`.

## Criação de CLAUDE.md em subpastas

Quando uma pasta acumula regras específicas que não cabem nos níveis superiores, criar `CLAUDE.md` próprio. O arquivo herda regras dos níveis superiores e adiciona apenas o que é específico daquele escopo. Não duplicar regras já presentes em níveis superiores.
