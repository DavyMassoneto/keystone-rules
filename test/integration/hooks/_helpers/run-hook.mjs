import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const hookPath = fileURLToPath(
  new URL(
    '../../../../src/lib/hooks/reasoning-discipline/reasoning-discipline-detect.mjs',
    import.meta.url,
  ),
);

export function runHook(stdinPayload, options = {}) {
  const { timeout = 10000 } = options;
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [hookPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`runHook timed out after ${timeout}ms`));
    }, timeout);
    child.stdout.on('data', (data) => {
      stdout += data;
    });
    child.stderr.on('data', (data) => {
      stderr += data;
    });
    child.on('close', (exitCode) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode });
    });
    child.stdin.write(stdinPayload);
    child.stdin.end();
  });
}
