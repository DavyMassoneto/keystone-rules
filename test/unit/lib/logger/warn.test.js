import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { warn } from '#lib';

const originalIsTTY = process.stdout.isTTY;

let stdoutSpy;
let stderrSpy;

function setTTY(value) {
  Object.defineProperty(process.stdout, 'isTTY', { value, configurable: true });
}

beforeEach(() => {
  stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
});

afterEach(() => {
  stdoutSpy.mockRestore();
  stderrSpy.mockRestore();
  Object.defineProperty(process.stdout, 'isTTY', {
    value: originalIsTTY,
    configurable: true,
  });
  vi.unstubAllEnvs();
});

describe('warn', () => {
  it('writes a yellow prefixed message to stderr when colors are enabled', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '');
    warn('careful');
    expect(stderrSpy).toHaveBeenCalledWith('\x1b[33m[WARN] careful\x1b[0m\n');
    expect(stdoutSpy).not.toHaveBeenCalled();
  });

  it('writes a plain prefixed message to stderr when NO_COLOR is set', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '1');
    warn('careful');
    expect(stderrSpy).toHaveBeenCalledWith('[WARN] careful\n');
    expect(stdoutSpy).not.toHaveBeenCalled();
  });

  it('writes a plain prefixed message to stderr when stdout is not a TTY', () => {
    setTTY(false);
    warn('careful');
    expect(stderrSpy).toHaveBeenCalledWith('[WARN] careful\n');
    expect(stdoutSpy).not.toHaveBeenCalled();
  });
});
