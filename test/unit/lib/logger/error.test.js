import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { error } from '#lib';

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

describe('error', () => {
  it('writes a red prefixed string message to stderr when colors are enabled', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '');
    error('boom');
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy).toHaveBeenCalledWith('\x1b[31m[ERROR] boom\x1b[0m\n');
    expect(stdoutSpy).not.toHaveBeenCalled();
  });

  it('writes a plain prefixed string message to stderr when NO_COLOR is set', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '1');
    error('boom');
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy).toHaveBeenCalledWith('[ERROR] boom\n');
  });

  it('writes a plain prefixed string message to stderr when stdout is not a TTY', () => {
    setTTY(false);
    error('boom');
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy).toHaveBeenCalledWith('[ERROR] boom\n');
  });

  it('with an Error input and colors enabled, writes message line and dimmed stack on stderr', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '');
    const e = new Error('boom');
    e.stack = 'Error: boom\n    at first\n    at second';
    error(e);
    expect(stderrSpy).toHaveBeenCalledTimes(2);
    expect(stderrSpy).toHaveBeenNthCalledWith(
      1,
      '\x1b[31m[ERROR] boom\x1b[0m\n',
    );
    expect(stderrSpy).toHaveBeenNthCalledWith(
      2,
      '\x1b[2m    at first\n    at second\x1b[0m\n',
    );
  });

  it('with an Error input and colors disabled, writes message line and plain stack on stderr', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '1');
    const e = new Error('boom');
    e.stack = 'Error: boom\n    at first\n    at second';
    error(e);
    expect(stderrSpy).toHaveBeenCalledTimes(2);
    expect(stderrSpy).toHaveBeenNthCalledWith(1, '[ERROR] boom\n');
    expect(stderrSpy).toHaveBeenNthCalledWith(2, '    at first\n    at second\n');
  });

  it('with an Error input that has no stack, writes only the message line', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '');
    const e = new Error('boom');
    delete e.stack;
    error(e);
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy).toHaveBeenCalledWith('\x1b[31m[ERROR] boom\x1b[0m\n');
  });
});
