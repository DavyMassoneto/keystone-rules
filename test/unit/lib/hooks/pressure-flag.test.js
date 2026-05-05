import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { access, mkdir, unlink, writeFile } from 'node:fs/promises';
import { PressureFlag } from '#lib/hooks';

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual('node:fs/promises');
  return {
    ...actual,
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    unlink: vi.fn(),
    access: vi.fn(),
  };
});

const ORIGINAL_PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR;

beforeEach(() => {
  process.env.CLAUDE_PROJECT_DIR = '/tmp/test-project';
});

afterEach(() => {
  if (ORIGINAL_PROJECT_DIR === undefined) {
    delete process.env.CLAUDE_PROJECT_DIR;
  } else {
    process.env.CLAUDE_PROJECT_DIR = ORIGINAL_PROJECT_DIR;
  }
  vi.clearAllMocks();
});

describe('PressureFlag', () => {
  it('computes a session-scoped path under .claude/hook-state/reasoning-discipline/', () => {
    const flag = new PressureFlag('abc-123');
    expect(flag.path).toMatch(
      /[/\\]\.claude[/\\]hook-state[/\\]reasoning-discipline[/\\]abc-123\.flag$/,
    );
  });

  it('write creates the parent directory recursively and writes an empty file', async () => {
    const flag = new PressureFlag('abc');
    await flag.write();
    expect(mkdir).toHaveBeenCalledWith(
      expect.stringMatching(/reasoning-discipline$/),
      { recursive: true },
    );
    expect(writeFile).toHaveBeenCalledWith(flag.path, '');
  });

  it('has returns true when access resolves', async () => {
    access.mockResolvedValue(undefined);
    const flag = new PressureFlag('abc');
    expect(await flag.has()).toBe(true);
  });

  it('has returns false when access rejects', async () => {
    access.mockRejectedValue(new Error('ENOENT'));
    const flag = new PressureFlag('abc');
    expect(await flag.has()).toBe(false);
  });

  it('clear deletes the flag file', async () => {
    const flag = new PressureFlag('abc');
    await flag.clear();
    expect(unlink).toHaveBeenCalledWith(flag.path);
  });

  it('clear is idempotent when the file does not exist', async () => {
    unlink.mockRejectedValue(new Error('ENOENT'));
    const flag = new PressureFlag('abc');
    await expect(flag.clear()).resolves.toBeUndefined();
  });
});
