import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { print } from '#lib';

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

describe('print', () => {
  it('writes the message to stdout with a trailing newline', () => {
    print('hello');
    expect(stdoutSpy).toHaveBeenCalledWith('hello\n');
  });

  it('does not write to stderr', () => {
    print('hello');
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it('does not apply color codes when stdout is a TTY and NO_COLOR is unset', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '');
    print('plain text');
    expect(stdoutSpy).toHaveBeenCalledWith('plain text\n');
  });

  it('does not apply color codes when NO_COLOR is set', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '1');
    print('plain text');
    expect(stdoutSpy).toHaveBeenCalledWith('plain text\n');
  });

  it('does not apply color codes when stdout is not a TTY', () => {
    setTTY(false);
    print('plain text');
    expect(stdoutSpy).toHaveBeenCalledWith('plain text\n');
  });
});
