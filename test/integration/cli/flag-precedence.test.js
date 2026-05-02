import { describe, it, expect } from 'vitest';
import { getPackageInfo } from '#lib';
import { runCli } from './_helpers/index.js';

const { version } = getPackageInfo();

describe('cli flag precedence', () => {
  it('runs version when --version is combined with an unknown command', async () => {
    const { stdout, stderr, exitCode } = await runCli(['unknown', '--version']);
    expect(exitCode).toBe(0);
    expect(stdout).toBe(`keystone-rules ${version}\n`);
    expect(stderr).toBe('');
  });

  it('runs version when both --version and --help flags are set', async () => {
    const { stdout, stderr, exitCode } = await runCli(['--version', '--help']);
    expect(exitCode).toBe(0);
    expect(stdout).toBe(`keystone-rules ${version}\n`);
    expect(stderr).toBe('');
  });
});
