import { colorsEnabled } from './colors-enabled.js';

export function warn(msg) {
  const line = colorsEnabled()
    ? `\x1b[33m[WARN] ${msg}\x1b[0m\n`
    : `[WARN] ${msg}\n`;
  process.stderr.write(line);
}
