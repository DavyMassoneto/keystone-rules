import { describe, it, expect } from 'vitest';
import { KeystoneError, UnknownCommandError } from '#lib';

describe('UnknownCommandError', () => {
  it('extends KeystoneError', () => {
    const err = new UnknownCommandError('nope');
    expect(err).toBeInstanceOf(KeystoneError);
    expect(err).toBeInstanceOf(UnknownCommandError);
  });

  it('preserves the message provided to the constructor', () => {
    const err = new UnknownCommandError('nope');
    expect(err.message).toBe('nope');
  });

  it('sets code to UNKNOWN_COMMAND', () => {
    const err = new UnknownCommandError('nope');
    expect(err.code).toBe('UNKNOWN_COMMAND');
  });

  it('sets exitCode to 3', () => {
    const err = new UnknownCommandError('nope');
    expect(err.exitCode).toBe(3);
  });

  it('sets name to UnknownCommandError', () => {
    const err = new UnknownCommandError('nope');
    expect(err.name).toBe('UnknownCommandError');
  });
});
