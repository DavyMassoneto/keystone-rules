import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { getClaudeHome } from '#lib';

vi.mock('node:os', async () => {
  const actual = await vi.importActual('node:os');
  return { ...actual, homedir: vi.fn() };
});

const originalEnv = process.env.KEYSTONE_CLAUDE_HOME;

beforeEach(() => {
  vi.mocked(homedir).mockReturnValue(join('/tmp', 'mock-home'));
  delete process.env.KEYSTONE_CLAUDE_HOME;
});

afterEach(() => {
  if (originalEnv === undefined) {
    delete process.env.KEYSTONE_CLAUDE_HOME;
  } else {
    process.env.KEYSTONE_CLAUDE_HOME = originalEnv;
  }
});

describe('getClaudeHome', () => {
  it('returns the home directory joined with .claude', () => {
    expect(getClaudeHome()).toBe(join('/tmp', 'mock-home', '.claude'));
  });

  it('reflects an updated homedir on subsequent calls', () => {
    vi.mocked(homedir).mockReturnValue(join('/var', 'alt-home'));
    expect(getClaudeHome()).toBe(join('/var', 'alt-home', '.claude'));
  });

  it('returns KEYSTONE_CLAUDE_HOME when the env var is set', () => {
    process.env.KEYSTONE_CLAUDE_HOME = join('/custom', 'claude-home');
    expect(getClaudeHome()).toBe(join('/custom', 'claude-home'));
  });

  it('falls back to homedir when KEYSTONE_CLAUDE_HOME is empty', () => {
    process.env.KEYSTONE_CLAUDE_HOME = '';
    expect(getClaudeHome()).toBe(join('/tmp', 'mock-home', '.claude'));
  });
});
