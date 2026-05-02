import { describe, it, expect, vi, beforeEach } from 'vitest';
import { access } from 'node:fs/promises';
import { pathExists } from '#lib';

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual('node:fs/promises');
  return { ...actual, access: vi.fn() };
});

beforeEach(() => {
  vi.mocked(access).mockReset();
});

describe('pathExists', () => {
  it('returns true when access resolves', async () => {
    vi.mocked(access).mockResolvedValue(undefined);
    expect(await pathExists('/some/file')).toBe(true);
  });

  it('returns false when access rejects with ENOENT', async () => {
    const err = new Error('not found');
    err.code = 'ENOENT';
    vi.mocked(access).mockRejectedValue(err);
    expect(await pathExists('/missing')).toBe(false);
  });

  it('returns false when access rejects with any other error', async () => {
    vi.mocked(access).mockRejectedValue(new Error('boom'));
    expect(await pathExists('/broken')).toBe(false);
  });
});
