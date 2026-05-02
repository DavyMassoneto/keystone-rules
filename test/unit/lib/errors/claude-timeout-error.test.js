import { describe, it, expect } from 'vitest';
import { KeystoneError, ClaudeTimeoutError } from '#lib';

describe('ClaudeTimeoutError', () => {
  it('extends KeystoneError', () => {
    const err = new ClaudeTimeoutError('claude timeout');
    expect(err).toBeInstanceOf(KeystoneError);
    expect(err).toBeInstanceOf(ClaudeTimeoutError);
  });

  it('preserves the message provided to the constructor', () => {
    const err = new ClaudeTimeoutError('claude timeout');
    expect(err.message).toBe('claude timeout');
  });

  it('sets code to CLAUDE_TIMEOUT', () => {
    const err = new ClaudeTimeoutError('claude timeout');
    expect(err.code).toBe('CLAUDE_TIMEOUT');
  });

  it('sets exitCode to 7', () => {
    const err = new ClaudeTimeoutError('claude timeout');
    expect(err.exitCode).toBe(7);
  });

  it('sets name to ClaudeTimeoutError', () => {
    const err = new ClaudeTimeoutError('claude timeout');
    expect(err.name).toBe('ClaudeTimeoutError');
  });
});
