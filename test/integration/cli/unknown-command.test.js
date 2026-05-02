import { describe, it, expect } from 'vitest';
import { runCli } from './_helpers/index.js';

describe('cli unknown command', () => {
  it('prints an error to stderr and exits with code 3', async () => {
    const { stdout, stderr, exitCode } = await runCli(['install']);
    expect(exitCode).toBe(3);
    expect(stdout).toBe('');
    expect(stderr).toBe(
      "[ERROR] Unknown command: 'install'. Run 'ks help' to see available commands.\n",
    );
  });

  it('does not include ANSI color codes when NO_COLOR is set', async () => {
    const { stderr, exitCode } = await runCli(['install'], {
      env: { NO_COLOR: '1' },
    });
    expect(exitCode).toBe(3);
    expect(stderr).not.toMatch(/\x1b\[/);
  });
});
