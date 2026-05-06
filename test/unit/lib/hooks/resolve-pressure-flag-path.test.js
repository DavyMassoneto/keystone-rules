import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidHookConfigError } from '#lib';
import { resolvePressureFlagPath } from '#lib/hooks';

const ORIGINAL_PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR;

beforeEach(() => {
  process.env.CLAUDE_PROJECT_DIR = '/tmp/test-project';
});

afterEach(() => {
  if (ORIGINAL_PROJECT_DIR === undefined) {
    delete process.env.CLAUDE_PROJECT_DIR;
  } else {
    process.env.CLAUDE_PROJECT_DIR = ORIGINAL_PROJECT_DIR;
  }
});

describe('resolvePressureFlagPath', () => {
  it('returns an absolute path under .claude/hook-state/reasoning-discipline scoped to the session', () => {
    expect(resolvePressureFlagPath('abc-123')).toMatch(
      /[/\\]\.claude[/\\]hook-state[/\\]reasoning-discipline[/\\]abc-123\.flag$/,
    );
  });

  it('roots the path at CLAUDE_PROJECT_DIR', () => {
    expect(resolvePressureFlagPath('abc-123')).toMatch(
      /^[/\\]?tmp[/\\]test-project[/\\]/,
    );
  });

  it('throws InvalidHookConfigError when CLAUDE_PROJECT_DIR is not set', () => {
    delete process.env.CLAUDE_PROJECT_DIR;
    expect(() => resolvePressureFlagPath('abc')).toThrow(InvalidHookConfigError);
    expect(() => resolvePressureFlagPath('abc')).toThrow(
      'Hook environment missing: CLAUDE_PROJECT_DIR is not set',
    );
  });

  it('throws InvalidHookConfigError when CLAUDE_PROJECT_DIR is empty', () => {
    process.env.CLAUDE_PROJECT_DIR = '';
    expect(() => resolvePressureFlagPath('abc')).toThrow(
      'Hook environment missing: CLAUDE_PROJECT_DIR is not set',
    );
  });
});
