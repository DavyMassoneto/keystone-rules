import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { info } from '#lib';

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

describe('info', () => {
  it('writes a cyan prefixed message to stdout when colors are enabled', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '');
    info('hello');
    expect(stdoutSpy).toHaveBeenCalledWith('\x1b[36m[INFO] hello\x1b[0m\n');
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it('writes a plain prefixed message to stdout when NO_COLOR is set', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '1');
    info('hello');
    expect(stdoutSpy).toHaveBeenCalledWith('[INFO] hello\n');
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it('writes a plain prefixed message to stdout when stdout is not a TTY', () => {
    setTTY(false);
    info('hello');
    expect(stdoutSpy).toHaveBeenCalledWith('[INFO] hello\n');
    expect(stderrSpy).not.toHaveBeenCalled();
  });
});
