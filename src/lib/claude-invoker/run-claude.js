import { spawn } from 'node:child_process';
import { ClaudeNotFoundError } from '../errors/claude-not-found-error.js';
import { ClaudeTimeoutError } from '../errors/claude-timeout-error.js';
import { isWindows } from '../platform/index.js';
import { SettleController } from './settle-controller.js';

export function runClaude(args, options = {}) {
  const { timeout, env, cwd } = options;
  return new Promise((resolve, reject) => {
    const child = spawn('claude', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: isWindows(),
      env: env ? { ...process.env, ...env } : process.env,
      cwd,
    });

    let stdout = '';
    let stderr = '';
    const controller = new SettleController();

    if (timeout) {
      controller.setTimer(
        setTimeout(() => {
          child.kill();
          controller.settle(
            reject,
            new ClaudeTimeoutError(`Claude Code timed out after ${timeout}ms`),
          );
        }, timeout),
      );
    }

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', (err) => {
      if (err.code === 'ENOENT') {
        controller.settle(
          reject,
          new ClaudeNotFoundError('Claude Code binary not found in PATH'),
        );
      } else {
        controller.settle(reject, err);
      }
    });

    child.on('close', (exitCode) => {
      controller.settle(resolve, { stdout, stderr, exitCode });
    });
  });
}
