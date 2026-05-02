import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('#lib', async () => {
  const actual = await vi.importActual('#lib');
  return {
    ...actual,
    print: vi.fn(),
    error: vi.fn(),
    getPackageInfo: vi.fn(() => ({
      name: 'keystone-rules',
      version: '1.2.3',
      description: 'desc',
    })),
  };
});

import { run } from '#cli';
import { print, error } from '#lib';

beforeEach(() => {
  vi.mocked(print).mockClear();
  vi.mocked(error).mockClear();
});

describe('run', () => {
  it('runs the version command for argv ["version"] and returns 0', async () => {
    expect(await run(['version'])).toBe(0);
    expect(print).toHaveBeenCalledWith('keystone-rules 1.2.3');
  });

  it('runs the version command for argv ["--version"] and returns 0', async () => {
    expect(await run(['--version'])).toBe(0);
    expect(print).toHaveBeenCalledWith('keystone-rules 1.2.3');
  });

  it('runs the version command for argv ["-v"] and returns 0', async () => {
    expect(await run(['-v'])).toBe(0);
    expect(print).toHaveBeenCalledWith('keystone-rules 1.2.3');
  });

  it('runs the help command for argv ["help"] and returns 0', async () => {
    expect(await run(['help'])).toBe(0);
    expect(print).toHaveBeenCalled();
  });

  it('runs the help command for argv ["--help"] and returns 0', async () => {
    expect(await run(['--help'])).toBe(0);
    expect(print).toHaveBeenCalled();
  });

  it('runs the help command for argv ["-h"] and returns 0', async () => {
    expect(await run(['-h'])).toBe(0);
    expect(print).toHaveBeenCalled();
  });

  it('runs the help command for empty argv and returns 0', async () => {
    expect(await run([])).toBe(0);
    expect(print).toHaveBeenCalled();
  });

  it('returns exit code 3 and reports an unknown command via error()', async () => {
    expect(await run(['install'])).toBe(3);
    expect(error).toHaveBeenCalledWith(
      "Unknown command: 'install'. Run 'ks help' to see available commands.",
    );
  });

  it('prefers --version over an unknown command', async () => {
    expect(await run(['unknown', '--version'])).toBe(0);
    expect(print).toHaveBeenCalledWith('keystone-rules 1.2.3');
  });

  it('prefers --version over --help when both flags are set', async () => {
    expect(await run(['--version', '--help'])).toBe(0);
    expect(print).toHaveBeenCalledWith('keystone-rules 1.2.3');
  });
});
