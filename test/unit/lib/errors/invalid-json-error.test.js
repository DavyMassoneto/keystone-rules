import { describe, it, expect } from 'vitest';
import { KeystoneError, InvalidJsonError } from '#lib';

describe('InvalidJsonError', () => {
  it('extends KeystoneError', () => {
    const err = new InvalidJsonError('bad json');
    expect(err).toBeInstanceOf(KeystoneError);
    expect(err).toBeInstanceOf(InvalidJsonError);
  });

  it('preserves the message provided to the constructor', () => {
    const err = new InvalidJsonError('bad json');
    expect(err.message).toBe('bad json');
  });

  it('sets code to INVALID_JSON', () => {
    const err = new InvalidJsonError('bad json');
    expect(err.code).toBe('INVALID_JSON');
  });

  it('sets exitCode to 5', () => {
    const err = new InvalidJsonError('bad json');
    expect(err.exitCode).toBe(5);
  });

  it('sets name to InvalidJsonError', () => {
    const err = new InvalidJsonError('bad json');
    expect(err.name).toBe('InvalidJsonError');
  });
});
