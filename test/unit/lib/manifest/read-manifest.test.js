import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readManifest } from '#lib/manifest';
import { pathExists, readJsonFile } from '#lib/file-ops';

vi.mock('#lib/file-ops', async () => {
  const actual = await vi.importActual('#lib/file-ops');
  return { ...actual, pathExists: vi.fn(), readJsonFile: vi.fn() };
});

beforeEach(() => {
  vi.mocked(pathExists).mockReset();
  vi.mocked(readJsonFile).mockReset();
});

describe('readManifest', () => {
  it('returns null when the manifest file does not exist', async () => {
    vi.mocked(pathExists).mockResolvedValue(false);
    expect(await readManifest()).toBe(null);
    expect(readJsonFile).not.toHaveBeenCalled();
  });

  it('returns the parsed manifest when the file exists', async () => {
    const manifest = {
      version: '1.0.0',
      installedAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
      files: [{ path: 'a.md', hash: 'abc' }],
      mergedFiles: ['CLAUDE.md'],
    };
    vi.mocked(pathExists).mockResolvedValue(true);
    vi.mocked(readJsonFile).mockResolvedValue(manifest);
    expect(await readManifest()).toBe(manifest);
  });

  it('passes a non-empty manifest path to file-ops helpers', async () => {
    vi.mocked(pathExists).mockResolvedValue(true);
    vi.mocked(readJsonFile).mockResolvedValue({});
    await readManifest();
    const existsArg = vi.mocked(pathExists).mock.calls[0][0];
    const readArg = vi.mocked(readJsonFile).mock.calls[0][0];
    expect(typeof existsArg).toBe('string');
    expect(existsArg.length).toBeGreaterThan(0);
    expect(readArg).toBe(existsArg);
  });
});
