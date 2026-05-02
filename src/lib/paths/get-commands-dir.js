import { join } from 'node:path';
import { getClaudeHome } from './get-claude-home.js';

export function getCommandsDir() {
  return join(getClaudeHome(), 'commands');
}
