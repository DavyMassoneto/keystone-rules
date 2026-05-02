import { join } from 'node:path';
import { getClaudeHome } from './get-claude-home.js';

export function getSettingsPath() {
  return join(getClaudeHome(), 'settings.json');
}
