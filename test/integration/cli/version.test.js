import { describe, it, expect } from 'vitest';
import { getPackageInfo } from '#lib';
import { runCli } from './_helpers/index.js';

const { version } = getPackageInfo();

describe('cli version', () => {
  it('runs via the "version" subcommand', async () => {
    const { stdout, stderr, exitCode } = await runCli(['version']);
    expect(exitCode).toBe(0);
    expect(stdout).toBe(`keystone-rules ${version}\n`);
    expect(stderr).toBe('');
  });

  it('runs via the "--version" flag', async () => {
    const { stdout, stderr, exitCode } = await runCli(['--version']);
    expect(exitCode).toBe(0);
    expect(stdout).toBe(`keystone-rules ${version}\n`);
    expect(stderr).toBe('');
  });

  it('runs via the "-v" short flag', async () => {
    const { stdout, stderr, exitCode } = await runCli(['-v']);
    expect(exitCode).toBe(0);
    expect(stdout).toBe(`keystone-rules ${version}\n`);
    expect(stderr).toBe('');
  });
});
