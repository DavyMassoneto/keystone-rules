import { describe, it, expect } from 'vitest';
import { KeystoneError, InvalidArgumentError } from '#lib';

describe('InvalidArgumentError', () => {
  it('extends KeystoneError', () => {
    const err = new InvalidArgumentError('bad arg');
    expect(err).toBeInstanceOf(KeystoneError);
    expect(err).toBeInstanceOf(InvalidArgumentError);
  });

  it('preserves the message provided to the constructor', () => {
    const err = new InvalidArgumentError('bad arg');
    expect(err.message).toBe('bad arg');
  });

  it('sets code to INVALID_ARGUMENT', () => {
    const err = new InvalidArgumentError('bad arg');
    expect(err.code).toBe('INVALID_ARGUMENT');
  });

  it('sets exitCode to 2', () => {
    const err = new InvalidArgumentError('bad arg');
    expect(err.exitCode).toBe(2);
  });

  it('sets name to InvalidArgumentError', () => {
    const err = new InvalidArgumentError('bad arg');
    expect(err.name).toBe('InvalidArgumentError');
  });
});
