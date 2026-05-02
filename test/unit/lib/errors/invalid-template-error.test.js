import { describe, it, expect } from 'vitest';
import { KeystoneError, InvalidTemplateError } from '#lib';

describe('InvalidTemplateError', () => {
  it('extends KeystoneError', () => {
    const err = new InvalidTemplateError('bad template');
    expect(err).toBeInstanceOf(KeystoneError);
    expect(err).toBeInstanceOf(InvalidTemplateError);
  });

  it('preserves the message provided to the constructor', () => {
    const err = new InvalidTemplateError('bad template');
    expect(err.message).toBe('bad template');
  });

  it('sets code to INVALID_TEMPLATE', () => {
    const err = new InvalidTemplateError('bad template');
    expect(err.code).toBe('INVALID_TEMPLATE');
  });

  it('sets exitCode to 8', () => {
    const err = new InvalidTemplateError('bad template');
    expect(err.exitCode).toBe(8);
  });

  it('sets name to InvalidTemplateError', () => {
    const err = new InvalidTemplateError('bad template');
    expect(err.name).toBe('InvalidTemplateError');
  });
});
