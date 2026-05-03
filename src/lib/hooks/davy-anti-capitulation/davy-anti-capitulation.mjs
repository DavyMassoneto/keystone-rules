#!/usr/bin/env node
import { runDavyAntiCapitulationHook } from './run-davy-anti-capitulation-hook.js';

try {
  await runDavyAntiCapitulationHook();
} catch (err) {
  process.stderr.write(`davy-anti-capitulation hook failed: ${err.message}\n`);
  process.exit(1);
}
