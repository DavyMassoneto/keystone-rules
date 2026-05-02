import { describe, it, expect, afterEach, vi } from 'vitest';
import { colorsEnabled } from './colors-enabled.js';

const originalIsTTY = process.stdout.isTTY;

function setIsTTY(value) {
  Object.defineProperty(process.stdout, 'isTTY', {
    value,
    configurable: true,
  });
}

afterEach(() => {
  Object.defineProperty(process.stdout, 'isTTY', {
    value: originalIsTTY,
    configurable: true,
  });
  vi.unstubAllEnvs();
});

describe('colorsEnabled', () => {
  it('returns true when stdout is TTY and NO_COLOR is not set', () => {
    setIsTTY(true);
    vi.stubEnv('NO_COLOR', '');
    expect(colorsEnabled()).toBe(true);
  });

  it('returns false when NO_COLOR is set even on a TTY', () => {
    setIsTTY(true);
    vi.stubEnv('NO_COLOR', '1');
    expect(colorsEnabled()).toBe(false);
  });

  it('returns false when stdout is not a TTY regardless of NO_COLOR', () => {
    setIsTTY(false);
    vi.stubEnv('NO_COLOR', '');
    expect(colorsEnabled()).toBe(false);
  });
});
