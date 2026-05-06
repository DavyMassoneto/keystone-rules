import { InvalidHookConfigError } from '#lib/errors';
import { join } from 'node:path';

export function resolvePressureFlagPath(sessionId) {
  const projectDir = process.env.CLAUDE_PROJECT_DIR;
  if (!projectDir) {
    throw new InvalidHookConfigError(
      'Hook environment missing: CLAUDE_PROJECT_DIR is not set',
    );
  }
  return join(
    projectDir,
    '.claude',
    'hook-state',
    'reasoning-discipline',
    `${sessionId}.flag`,
  );
}
