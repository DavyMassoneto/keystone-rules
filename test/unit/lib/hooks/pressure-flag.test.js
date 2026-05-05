import { afterEach, describe, expect, it, vi } from 'vitest';
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

afterEach(() => {
  vi.clearAllMocks();
});

const PATH = '/tmp/test-project/.claude/hook-state/reasoning-discipline/abc.flag';

describe('PressureFlag', () => {
  it('stores the path provided to the constructor verbatim', () => {
    const flag = new PressureFlag(PATH);
    expect(flag.path).toBe(PATH);
  });

  it('write creates the parent directory recursively and writes an empty file', async () => {
    const flag = new PressureFlag(PATH);
    await flag.write();
    expect(mkdir).toHaveBeenCalledWith(
      '/tmp/test-project/.claude/hook-state/reasoning-discipline',
      { recursive: true },
    );
    expect(writeFile).toHaveBeenCalledWith(PATH, '');
  });

  it('has returns true when access resolves', async () => {
    access.mockResolvedValue(undefined);
    expect(await new PressureFlag(PATH).has()).toBe(true);
  });

  it('has returns false when access rejects', async () => {
    access.mockRejectedValue(new Error('ENOENT'));
    expect(await new PressureFlag(PATH).has()).toBe(false);
  });

  it('clear deletes the flag file', async () => {
    await new PressureFlag(PATH).clear();
    expect(unlink).toHaveBeenCalledWith(PATH);
  });

  it('clear is idempotent when the file does not exist', async () => {
    unlink.mockRejectedValue(new Error('ENOENT'));
    await expect(new PressureFlag(PATH).clear()).resolves.toBeUndefined();
  });
});
