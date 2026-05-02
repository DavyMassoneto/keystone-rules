import { describe, it, expect, vi, beforeEach } from 'vitest';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { getCommandsDir } from '#lib';

vi.mock('node:os', async () => {
  const actual = await vi.importActual('node:os');
  return { ...actual, homedir: vi.fn() };
});

beforeEach(() => {
  vi.mocked(homedir).mockReturnValue(join('/tmp', 'mock-home'));
});

describe('getCommandsDir', () => {
  it('returns the commands directory under .claude', () => {
    expect(getCommandsDir()).toBe(
      join('/tmp', 'mock-home', '.claude', 'commands'),
    );
  });
});
