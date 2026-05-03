import { afterEach, describe, expect, it } from 'vitest';
import { Readable } from 'node:stream';
import { readStdin } from '#lib/hooks';

const originalStdin = process.stdin;

afterEach(() => {
  Object.defineProperty(process, 'stdin', {
    value: originalStdin,
    configurable: true,
  });
});

function mockStdinWith(chunks) {
  Object.defineProperty(process, 'stdin', {
    value: Readable.from(chunks),
    configurable: true,
  });
}

describe('readStdin', () => {
  it('returns the empty string when stdin closes immediately', async () => {
    mockStdinWith([]);
    expect(await readStdin()).toBe('');
  });

  it('returns the concatenation of every chunk emitted by stdin', async () => {
    mockStdinWith(['hello', ' ', 'world']);
    expect(await readStdin()).toBe('hello world');
  });

  it('handles a single payload arriving as one chunk', async () => {
    mockStdinWith(['{"prompt":"x"}']);
    expect(await readStdin()).toBe('{"prompt":"x"}');
  });
});
