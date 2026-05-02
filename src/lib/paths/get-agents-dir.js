import { join } from 'node:path';
import { getClaudeHome } from './get-claude-home.js';

export function getAgentsDir() {
  return join(getClaudeHome(), 'agents');
}
