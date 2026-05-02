import { describe, it, expect } from 'vitest';
import { KeystoneError, UnsupportedPlatformError } from '#lib';

describe('UnsupportedPlatformError', () => {
  it('extends KeystoneError', () => {
    const err = new UnsupportedPlatformError('aix');
    expect(err).toBeInstanceOf(KeystoneError);
    expect(err).toBeInstanceOf(UnsupportedPlatformError);
  });

  it('builds a descriptive message including the platform name', () => {
    const err = new UnsupportedPlatformError('aix');
    expect(err.message).toBe(
      'Platform "aix" is not supported. Supported: linux, darwin, win32.',
    );
  });

  it('sets code to UNSUPPORTED_PLATFORM', () => {
    const err = new UnsupportedPlatformError('aix');
    expect(err.code).toBe('UNSUPPORTED_PLATFORM');
  });

  it('sets exitCode to 4', () => {
    const err = new UnsupportedPlatformError('aix');
    expect(err.exitCode).toBe(4);
  });

  it('sets name to UnsupportedPlatformError', () => {
    const err = new UnsupportedPlatformError('aix');
    expect(err.name).toBe('UnsupportedPlatformError');
  });
});
