import { describe, it, expect } from 'vitest';
import { runCli } from './_helpers/index.js';

const expectedHelp = [
  'Usage: ks <command> [options]',
  '',
  'Available commands:',
  '  version    Print the keystone-rules version',
  '  help       Show available commands and usage information',
  '',
  "Run 'ks help <command>' for detailed information on a command.",
  '',
].join('\n');

describe('cli help', () => {
  it('runs via the "help" subcommand', async () => {
    const { stdout, stderr, exitCode } = await runCli(['help']);
    expect(exitCode).toBe(0);
    expect(stdout).toBe(expectedHelp);
    expect(stderr).toBe('');
  });

  it('runs via the "--help" flag', async () => {
    const { stdout, exitCode } = await runCli(['--help']);
    expect(exitCode).toBe(0);
    expect(stdout).toBe(expectedHelp);
  });

  it('runs via the "-h" short flag', async () => {
    const { stdout, exitCode } = await runCli(['-h']);
    expect(exitCode).toBe(0);
    expect(stdout).toBe(expectedHelp);
  });

  it('shows help when no arguments are provided', async () => {
    const { stdout, exitCode } = await runCli([]);
    expect(exitCode).toBe(0);
    expect(stdout).toBe(expectedHelp);
  });

  it('shows the general help even when a positional follows "help"', async () => {
    const { stdout, exitCode } = await runCli(['help', 'install']);
    expect(exitCode).toBe(0);
    expect(stdout).toBe(expectedHelp);
  });
});
