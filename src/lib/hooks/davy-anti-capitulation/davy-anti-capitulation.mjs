#!/usr/bin/env node
import { runReasoningDisciplineDetect } from './run-davy-anti-capitulation-hook.js';

try {
  await runReasoningDisciplineDetect();
} catch (err) {
  process.stderr.write(`davy-anti-capitulation hook failed: ${err.message}\n`);
  process.exit(1);
}
