import { describe, it, expect, vi, beforeEach } from 'vitest';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { getClaudeHome } from '#lib';

vi.mock('node:os', async () => {
  const actual = await vi.importActual('node:os');
  return { ...actual, homedir: vi.fn() };
});

beforeEach(() => {
  vi.mocked(homedir).mockReturnValue(join('/tmp', 'mock-home'));
});

describe('getClaudeHome', () => {
  it('returns the home directory joined with .claude', () => {
    expect(getClaudeHome()).toBe(join('/tmp', 'mock-home', '.claude'));
  });

  it('reflects an updated homedir on subsequent calls', () => {
    vi.mocked(homedir).mockReturnValue(join('/var', 'alt-home'));
    expect(getClaudeHome()).toBe(join('/var', 'alt-home', '.claude'));
  });
});
