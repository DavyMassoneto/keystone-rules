import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  detectPressure,
  formatHookContext,
  readStdin,
  validateHookConfig,
  validateHookEvent,
} from '#lib/hooks';

export async function runReasoningDisciplineDetect() {
  const event = validateHookEvent(JSON.parse(await readStdin()));
  const configPath = join(import.meta.dirname, 'reasoning-discipline.json');
  const config = validateHookConfig(
    JSON.parse(await readFile(configPath, 'utf8')),
  );
  if (detectPressure(event.prompt, config)) {
    process.stdout.write(formatHookContext(config.reminder));
  }
}
