# src/lib/errors/

Hierarquia de erros tipados.

## Classe base

`KeystoneError extends Error`. Construtor recebe `{ message, code, exitCode }` (objeto, não posicional). Define `this.name = this.constructor.name` para preservar nome em stack traces.

## Subclasses

Cada subclasse:
- Recebe APENAS `message` (e dados específicos quando relevante, ex.: `platform`) no construtor.
- Passa `code` e `exitCode` fixos via `super({ message, code, exitCode })`.
- Define `code` como SCREAMING_SNAKE_CASE igual ao nome da classe sem o sufixo "Error".
- Define `exitCode` sequencialmente: 1 para base, 2+ para subclasses em ordem de criação.

## Padrão de instanciação

```javascript
throw new InvalidArgumentError('bad arg');
throw new UnsupportedPlatformError(platform);  // monta mensagem internamente
```

Nunca instanciar `KeystoneError` direto — sempre via subclasse.
