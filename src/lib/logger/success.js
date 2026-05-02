import { colorsEnabled } from './colors-enabled.js';

export function success(msg) {
  const line = colorsEnabled()
    ? `\x1b[32m[OK] ${msg}\x1b[0m\n`
    : `[OK] ${msg}\n`;
  process.stdout.write(line);
}
