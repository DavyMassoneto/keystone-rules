# src/lib/doctor-checks/

Checks individuais executados pelo comando `doctor`.

## Schema de retorno

Cada check retorna:

```javascript
{
  name: string,           // identificador curto, ex.: 'node-version'
  label: string,          // descrição humana, ex.: 'Node.js version'
  status: 'ok' | 'warn' | 'error' | 'skipped',
  message: string,        // detalhe ou recomendação
}
```

## Severidades

- `ok`: aspecto saudável (incluindo casos onde ausência é estado válido, ex.: settings.json não existe → defaults do Claude Code)
- `warn`: estado não-crítico que merece atenção (ex.: ~/.claude/ ausente, basta rodar `claude` uma vez)
- `error`: condição que impede o keystone-rules de funcionar
- `skipped`: check não pôde rodar por dependência falha

## Dependências entre checks

Quando um check tem pré-requisito falho, retorna `skipped` SEM tentar executar a verificação. Orquestrador (`run-doctor-checks`) propaga contexto entre checks.

## Checks pendentes de install

Checks que dependem do comando `install` existir (manifest, hooks instalados) implementam apenas o caminho atual ("não instalado" → status apropriado) e marcam o caminho feliz como `it.todo` no teste correspondente. Quando `install` chegar, expandir implementação e converter `it.todo` para `it`.
