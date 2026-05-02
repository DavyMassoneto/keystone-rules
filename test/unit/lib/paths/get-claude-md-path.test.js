import { describe, it, expect, vi, beforeEach } from 'vitest';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { getClaudeMdPath } from '#lib';

vi.mock('node:os', async () => {
  const actual = await vi.importActual('node:os');
  return { ...actual, homedir: vi.fn() };
});

beforeEach(() => {
  vi.mocked(homedir).mockReturnValue(join('/tmp', 'mock-home'));
});

describe('getClaudeMdPath', () => {
  it('returns CLAUDE.md under .claude', () => {
    expect(getClaudeMdPath()).toBe(
      join('/tmp', 'mock-home', '.claude', 'CLAUDE.md'),
    );
  });
});
