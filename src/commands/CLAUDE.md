# src/commands/

Comandos do CLI.

## Padrão objeto descritor

Cada comando exporta uma constante objeto:

```javascript
export const xxxxxCommand = {
  name: 'xxxxx',
  description: 'Short one-line description',
  run: async (commands, parsed) => {
    // ...
    return exitCode;
  },
};
```

- `name`: identificador único usado pelo router e pelo help.
- `description`: uma linha, frase imperativa começando com verbo.
- `run`: função async (mesmo se síncrona, padroniza assinatura). Recebe o registry de comandos (para help iterar) e o objeto `parsed` do arg-parser. Retorna exit code (number).

## Registry

`src/commands/index.js` reexporta cada comando E exporta um objeto `commands` mapeando `name` → comando, montado no próprio arquivo:

```javascript
export * from './version.js';
export * from './help.js';
export * from './doctor.js';

import { versionCommand } from './version.js';
import { helpCommand } from './help.js';
import { doctorCommand } from './doctor.js';

export const commands = {
  [versionCommand.name]: versionCommand,
  [helpCommand.name]: helpCommand,
  [doctorCommand.name]: doctorCommand,
};
```

Adicionar comando novo = criar arquivo + adicionar ao barrel + adicionar ao dict `commands`. Help itera automaticamente.
