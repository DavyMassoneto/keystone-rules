import { describe, it, expect } from 'vitest';
import { KeystoneError } from '#lib';

describe('KeystoneError', () => {
  it('extends native Error', () => {
    const err = new KeystoneError({ message: 'boom' });
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(KeystoneError);
  });

  it('exposes message, code, and exitCode from the constructor object', () => {
    const err = new KeystoneError({
      message: 'boom',
      code: 'GENERIC',
      exitCode: 7,
    });
    expect(err.message).toBe('boom');
    expect(err.code).toBe('GENERIC');
    expect(err.exitCode).toBe(7);
  });

  it('defaults code to KEYSTONE and exitCode to 1 when only message is provided', () => {
    const err = new KeystoneError({ message: 'boom' });
    expect(err.code).toBe('KEYSTONE');
    expect(err.exitCode).toBe(1);
  });

  it('sets name to the constructor name', () => {
    const err = new KeystoneError({ message: 'boom' });
    expect(err.name).toBe('KeystoneError');
  });

  it('captures a stack trace', () => {
    const err = new KeystoneError({ message: 'boom' });
    expect(typeof err.stack).toBe('string');
    expect(err.stack).toContain('KeystoneError');
  });
});
