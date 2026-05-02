import { describe, it, expect, vi, beforeEach } from 'vitest';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { getAgentsDir } from '#lib';

vi.mock('node:os', async () => {
  const actual = await vi.importActual('node:os');
  return { ...actual, homedir: vi.fn() };
});

beforeEach(() => {
  vi.mocked(homedir).mockReturnValue(join('/tmp', 'mock-home'));
});

describe('getAgentsDir', () => {
  it('returns the agents directory under .claude', () => {
    expect(getAgentsDir()).toBe(join('/tmp', 'mock-home', '.claude', 'agents'));
  });
});
