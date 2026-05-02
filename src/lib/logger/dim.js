import { colorsEnabled } from './colors-enabled.js';

export function dim(msg) {
  const line = colorsEnabled() ? `\x1b[2m${msg}\x1b[0m\n` : `${msg}\n`;
  process.stdout.write(line);
}
