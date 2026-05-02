import { colorsEnabled } from './colors-enabled.js';

export function info(msg) {
  const line = colorsEnabled()
    ? `\x1b[36m[INFO] ${msg}\x1b[0m\n`
    : `[INFO] ${msg}\n`;
  process.stdout.write(line);
}
