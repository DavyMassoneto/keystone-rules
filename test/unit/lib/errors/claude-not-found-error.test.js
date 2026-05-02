import { describe, it, expect } from 'vitest';
import { KeystoneError, ClaudeNotFoundError } from '#lib';

describe('ClaudeNotFoundError', () => {
  it('extends KeystoneError', () => {
    const err = new ClaudeNotFoundError('claude missing');
    expect(err).toBeInstanceOf(KeystoneError);
    expect(err).toBeInstanceOf(ClaudeNotFoundError);
  });

  it('preserves the message provided to the constructor', () => {
    const err = new ClaudeNotFoundError('claude missing');
    expect(err.message).toBe('claude missing');
  });

  it('sets code to CLAUDE_NOT_FOUND', () => {
    const err = new ClaudeNotFoundError('claude missing');
    expect(err.code).toBe('CLAUDE_NOT_FOUND');
  });

  it('sets exitCode to 6', () => {
    const err = new ClaudeNotFoundError('claude missing');
    expect(err.exitCode).toBe(6);
  });

  it('sets name to ClaudeNotFoundError', () => {
    const err = new ClaudeNotFoundError('claude missing');
    expect(err.name).toBe('ClaudeNotFoundError');
  });
});
