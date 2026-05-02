import { colorsEnabled } from './colors-enabled.js';

export function error(input) {
  const enabled = colorsEnabled();
  const isError = input instanceof Error;
  const message = isError ? input.message : input;

  const headLine = enabled
    ? `\x1b[31m[ERROR] ${message}\x1b[0m\n`
    : `[ERROR] ${message}\n`;
  process.stderr.write(headLine);

  if (isError && input.stack) {
    const body = input.stack.slice(input.stack.indexOf('\n') + 1);
    const stackLine = enabled ? `\x1b[2m${body}\x1b[0m\n` : `${body}\n`;
    process.stderr.write(stackLine);
  }
}
