import { join } from 'node:path';
import { getHomeDir } from './get-home-dir.js';

export function getClaudeHome() {
  const override = process.env.KEYSTONE_CLAUDE_HOME;
  if (override) {
    return override;
  }
  return join(getHomeDir(), '.claude');
}
