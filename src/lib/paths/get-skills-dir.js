import { join } from 'node:path';
import { getClaudeHome } from './get-claude-home.js';

export function getSkillsDir() {
  return join(getClaudeHome(), 'skills');
}
