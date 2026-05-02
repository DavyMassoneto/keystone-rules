# docs/

Documentação interna do projeto. NÃO vai para o tarball npm.

## Arquivos

- `PENDING.md`: lista de `it.todo` por arquivo, com fase prevista de implementação.

## docs/PENDING.md

Sempre atualizado em paralelo com adição/remoção de `it.todo`. Quando `it.todo` é convertido para `it` real, remover entrada correspondente.

Formato:

```markdown
# Pending implementations

## Phase: <nome da fase futura>

### test/unit/lib/<pasta>/<arquivo>.test.js
- `nome do teste it.todo`
```
