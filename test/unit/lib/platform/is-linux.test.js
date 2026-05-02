import { describe, it, expect, afterEach } from 'vitest';
import { isLinux } from '#lib';

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

describe('isLinux', () => {
  it('returns true on linux', () => {
    setPlatform('linux');
    expect(isLinux()).toBe(true);
  });

  it('returns false on darwin', () => {
    setPlatform('darwin');
    expect(isLinux()).toBe(false);
  });

  it('returns false on win32', () => {
    setPlatform('win32');
    expect(isLinux()).toBe(false);
  });

  it('returns false on an unsupported platform without throwing', () => {
    setPlatform('sunos');
    expect(() => isLinux()).not.toThrow();
    expect(isLinux()).toBe(false);
  });
});
