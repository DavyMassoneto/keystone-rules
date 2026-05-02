import { join } from 'node:path';
import { getClaudeHome } from './get-claude-home.js';

export function getKeystoneDir() {
  return join(getClaudeHome(), '.keystone');
}
