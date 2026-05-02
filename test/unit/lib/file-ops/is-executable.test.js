import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { access } from 'node:fs/promises';
import { isExecutable } from '#lib';

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual('node:fs/promises');
  return { ...actual, access: vi.fn() };
});

const originalPlatform = process.platform;

function setPlatform(value) {
  Object.defineProperty(process, 'platform', { value, configurable: true });
}

beforeEach(() => {
  vi.mocked(access).mockReset();
});

afterEach(() => {
  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
    configurable: true,
  });
});

describe('isExecutable', () => {
  it('returns true on Windows without inspecting permission bits', async () => {
    setPlatform('win32');
    vi.mocked(access).mockRejectedValue(new Error('should not be called'));
    expect(await isExecutable('/any/path')).toBe(true);
    expect(access).not.toHaveBeenCalled();
  });

  it('returns true on Linux when access(X_OK) resolves', async () => {
    setPlatform('linux');
    vi.mocked(access).mockResolvedValue(undefined);
    expect(await isExecutable('/usr/bin/git')).toBe(true);
  });

  it('returns false on Linux when access(X_OK) rejects', async () => {
    setPlatform('linux');
    vi.mocked(access).mockRejectedValue(new Error('EACCES'));
    expect(await isExecutable('/etc/passwd')).toBe(false);
  });

  it('returns true on macOS when access(X_OK) resolves', async () => {
    setPlatform('darwin');
    vi.mocked(access).mockResolvedValue(undefined);
    expect(await isExecutable('/usr/bin/zsh')).toBe(true);
  });
});
