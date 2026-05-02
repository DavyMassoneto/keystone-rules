import { join } from 'node:path';
import { getClaudeHome } from './get-claude-home.js';

export function getClaudeMdPath() {
  return join(getClaudeHome(), 'CLAUDE.md');
}
