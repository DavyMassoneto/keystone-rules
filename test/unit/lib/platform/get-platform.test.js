import { describe, it, expect, afterEach } from 'vitest';
import { getPlatform, UnsupportedPlatformError } from '#lib';

const originalPlatform = process.platform;

function setPlatform(value) {
  Object.defineProperty(process, 'platform', { value, configurable: true });
}

afterEach(() => {
  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
    configurable: true,
  });
});

describe('getPlatform', () => {
  it('returns linux on linux', () => {
    setPlatform('linux');
    expect(getPlatform()).toBe('linux');
  });

  it('returns darwin on macOS', () => {
    setPlatform('darwin');
    expect(getPlatform()).toBe('darwin');
  });

  it('returns win32 on Windows', () => {
    setPlatform('win32');
    expect(getPlatform()).toBe('win32');
  });

  it('throws UnsupportedPlatformError when platform is not supported', () => {
    setPlatform('aix');
    expect(() => getPlatform()).toThrow(UnsupportedPlatformError);
  });

  it('includes the unrecognised platform name in the error message', () => {
    setPlatform('aix');
    expect(() => getPlatform()).toThrow(/aix/);
  });
});
