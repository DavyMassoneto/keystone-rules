import { join } from 'node:path';
import { getHomeDir } from './get-home-dir.js';

export function getClaudeHome() {
  return join(getHomeDir(), '.claude');
}
