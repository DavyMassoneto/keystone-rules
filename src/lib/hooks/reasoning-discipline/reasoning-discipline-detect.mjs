#!/usr/bin/env node
import { runReasoningDisciplineDetect } from './run-davy-anti-capitulation-hook.js';

try {
  await runReasoningDisciplineDetect();
} catch (err) {
  process.stderr.write(
    `reasoning-discipline detect hook failed: ${err.message}\n`,
  );
  process.exit(1);
}
