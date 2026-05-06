import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFile } from 'node:fs/promises';
import { InvalidJsonError } from '#lib';
import { readTranscript } from '#lib/hooks';

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual('node:fs/promises');
  return { ...actual, readFile: vi.fn() };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('readTranscript', () => {
  it('returns an empty array for an empty file', async () => {
    readFile.mockResolvedValue('');
    expect(await readTranscript('/p')).toEqual([]);
  });

  it('parses a single JSONL line into an array of one event', async () => {
    readFile.mockResolvedValue('{"role":"user","content":"hi"}\n');
    expect(await readTranscript('/p')).toEqual([
      { role: 'user', content: 'hi' },
    ]);
  });

  it('parses multiple lines preserving order', async () => {
    readFile.mockResolvedValue(
      '{"role":"user","content":"hi"}\n{"role":"assistant","content":"hello"}\n',
    );
    expect(await readTranscript('/p')).toEqual([
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' },
    ]);
  });

  it('ignores blank lines (leading, trailing, and between events)', async () => {
    readFile.mockResolvedValue('\n{"a":1}\n\n{"b":2}\n\n');
    expect(await readTranscript('/p')).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it('throws InvalidJsonError including the failing line number', async () => {
    readFile.mockResolvedValue('{"a":1}\n{ broken json\n{"c":3}');
    await expect(readTranscript('/p')).rejects.toThrow(InvalidJsonError);
    await expect(readTranscript('/p')).rejects.toThrow(
      'Invalid JSON in transcript at line 2',
    );
  });

  it('passes the path argument through to readFile with utf8 encoding', async () => {
    readFile.mockResolvedValue('');
    await readTranscript('/some/path.jsonl');
    expect(readFile).toHaveBeenCalledWith('/some/path.jsonl', 'utf8');
  });
});
