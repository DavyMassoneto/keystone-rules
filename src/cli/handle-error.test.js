import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('#lib', async () => {
  const actual = await vi.importActual('#lib');
  return { ...actual, error: vi.fn() };
});

import { handleError } from './handle-error.js';
import { error, InvalidArgumentError, UnknownCommandError } from '#lib';

beforeEach(() => {
  vi.mocked(error).mockClear();
});

describe('handleError', () => {
  it('returns the exitCode and prints only the message for InvalidArgumentError', () => {
    const err = new InvalidArgumentError('bad arg');
    expect(handleError(err)).toBe(2);
    expect(error).toHaveBeenCalledWith('bad arg');
  });

  it('returns the exitCode for UnknownCommandError', () => {
    const err = new UnknownCommandError('not found');
    expect(handleError(err)).toBe(3);
    expect(error).toHaveBeenCalledWith('not found');
  });

  it('returns 1 and prints the full Error for non-KeystoneError instances', () => {
    const err = new Error('generic');
    expect(handleError(err)).toBe(1);
    expect(error).toHaveBeenCalledWith(err);
  });
});
