import { describe, it, expect, afterEach } from 'vitest';
import { isWindows } from '#lib';

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

describe('isWindows', () => {
  it('returns true on win32', () => {
    setPlatform('win32');
    expect(isWindows()).toBe(true);
  });

  it('returns false on linux', () => {
    setPlatform('linux');
    expect(isWindows()).toBe(false);
  });

  it('returns false on darwin', () => {
    setPlatform('darwin');
    expect(isWindows()).toBe(false);
  });

  it('returns false on an unsupported platform without throwing', () => {
    setPlatform('sunos');
    expect(() => isWindows()).not.toThrow();
    expect(isWindows()).toBe(false);
  });
});
