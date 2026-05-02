/**
 * Parses CLI argv into a structured representation.
 *
 * Convenções aceitas:
 * - `--flag=value`: long flag com valor.
 * - `--flag`: long flag, boolean true.
 * - `--no-flag`: long flag, boolean false. O prefixo `no-` é removido na
 *   chave — `--no-color` resulta em `{ color: false }`.
 * - `-f`: short alias, boolean true.
 * - `-f=value`: short alias com valor.
 *
 * NÃO existe sintaxe `--flag value` (espaço como separador). Quem quiser passar
 * valor usa `=`.
 *
 * Argumentos sem `-` no início são positionals. O primeiro positional, se
 * nenhum command foi definido ainda, vira o `command`; os demais vão para o
 * array `positional`.
 *
 * Se a mesma flag aparecer múltiplas vezes, a última ocorrência prevalece.
 *
 * @param {string[]} argv Array de argumentos (sem `node` nem path do script).
 * @returns {{ command: string | null, flags: Record<string, string | boolean>, positional: string[] }}
 */
export function parse(argv) {
  const flags = {};
  const positional = [];
  let command = null;

  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const body = arg.slice(2);
      const eqIndex = body.indexOf('=');
      if (eqIndex !== -1) {
        flags[body.slice(0, eqIndex)] = body.slice(eqIndex + 1);
      } else if (body.startsWith('no-')) {
        flags[body.slice(3)] = false;
      } else {
        flags[body] = true;
      }
    } else if (arg.startsWith('-')) {
      const body = arg.slice(1);
      const eqIndex = body.indexOf('=');
      if (eqIndex !== -1) {
        flags[body.slice(0, eqIndex)] = body.slice(eqIndex + 1);
      } else {
        flags[body] = true;
      }
    } else if (command === null) {
      command = arg;
    } else {
      positional.push(arg);
    }
  }

  return { command, flags, positional };
}
