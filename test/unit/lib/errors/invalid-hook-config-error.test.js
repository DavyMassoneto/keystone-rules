import { describe, it, expect } from 'vitest';
import { KeystoneError, InvalidHookConfigError } from '#lib';

describe('InvalidHookConfigError', () => {
  it('extends KeystoneError', () => {
    const err = new InvalidHookConfigError('bad config');
    expect(err).toBeInstanceOf(KeystoneError);
    expect(err).toBeInstanceOf(InvalidHookConfigError);
  });

  it('preserves the message provided to the constructor', () => {
    const err = new InvalidHookConfigError('bad config');
    expect(err.message).toBe('bad config');
  });

  it('sets code to INVALID_HOOK_CONFIG', () => {
    const err = new InvalidHookConfigError('bad config');
    expect(err.code).toBe('INVALID_HOOK_CONFIG');
  });

  it('sets exitCode to 9', () => {
    const err = new InvalidHookConfigError('bad config');
    expect(err.exitCode).toBe(9);
  });

  it('sets name to InvalidHookConfigError', () => {
    const err = new InvalidHookConfigError('bad config');
    expect(err.name).toBe('InvalidHookConfigError');
  });
});
