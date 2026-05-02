import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { dim } from '#lib';

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

describe('dim', () => {
  it('writes a dimmed message without prefix to stdout when colors are enabled', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '');
    dim('background note');
    expect(stdoutSpy).toHaveBeenCalledWith(
      '\x1b[2mbackground note\x1b[0m\n',
    );
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it('writes a plain message without prefix to stdout when NO_COLOR is set', () => {
    setTTY(true);
    vi.stubEnv('NO_COLOR', '1');
    dim('background note');
    expect(stdoutSpy).toHaveBeenCalledWith('background note\n');
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it('writes a plain message without prefix to stdout when stdout is not a TTY', () => {
    setTTY(false);
    dim('background note');
    expect(stdoutSpy).toHaveBeenCalledWith('background note\n');
    expect(stderrSpy).not.toHaveBeenCalled();
  });
});
