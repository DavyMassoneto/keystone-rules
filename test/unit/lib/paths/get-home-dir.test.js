import { describe, it, expect, vi, beforeEach } from 'vitest';
import { homedir } from 'node:os';
import { getHomeDir } from '#lib';

vi.mock('node:os', async () => {
  const actual = await vi.importActual('node:os');
  return { ...actual, homedir: vi.fn() };
});

beforeEach(() => {
  vi.mocked(homedir).mockReturnValue('/mock/home');
});

describe('getHomeDir', () => {
  it('returns whatever os.homedir reports', () => {
    expect(getHomeDir()).toBe('/mock/home');
  });

  it('reflects an updated homedir on subsequent calls', () => {
    vi.mocked(homedir).mockReturnValue('/other/home');
    expect(getHomeDir()).toBe('/other/home');
  });
});
