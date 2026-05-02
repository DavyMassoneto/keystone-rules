import { describe, it, expect, vi, beforeEach } from 'vitest';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { getManifestPath } from '#lib';

vi.mock('node:os', async () => {
  const actual = await vi.importActual('node:os');
  return { ...actual, homedir: vi.fn() };
});

beforeEach(() => {
  vi.mocked(homedir).mockReturnValue(join('/tmp', 'mock-home'));
});

describe('getManifestPath', () => {
  it('returns manifest.json under the keystone directory', () => {
    expect(getManifestPath()).toBe(
      join('/tmp', 'mock-home', '.claude', '.keystone', 'manifest.json'),
    );
  });
});
