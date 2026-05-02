import { describe, it, expect, afterEach } from 'vitest';
import { isMacOS } from '#lib';

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

describe('isMacOS', () => {
  it('returns true on darwin', () => {
    setPlatform('darwin');
    expect(isMacOS()).toBe(true);
  });

  it('returns false on linux', () => {
    setPlatform('linux');
    expect(isMacOS()).toBe(false);
  });

  it('returns false on win32', () => {
    setPlatform('win32');
    expect(isMacOS()).toBe(false);
  });

  it('returns false on an unsupported platform without throwing', () => {
    setPlatform('sunos');
    expect(() => isMacOS()).not.toThrow();
    expect(isMacOS()).toBe(false);
  });
});
