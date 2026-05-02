import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFile } from 'node:fs/promises';
import { readJsonFile, InvalidJsonError } from '#lib';

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual('node:fs/promises');
  return { ...actual, readFile: vi.fn() };
});

beforeEach(() => {
  vi.mocked(readFile).mockReset();
});

describe('readJsonFile', () => {
  it('returns the parsed object when JSON is valid', async () => {
    vi.mocked(readFile).mockResolvedValue('{"key":"value","n":1}');
    const result = await readJsonFile('/some/file.json');
    expect(result).toEqual({ key: 'value', n: 1 });
  });

  it('reads with utf8 encoding', async () => {
    vi.mocked(readFile).mockResolvedValue('{}');
    await readJsonFile('/some/file.json');
    expect(readFile).toHaveBeenCalledWith('/some/file.json', 'utf8');
  });

  it('throws InvalidJsonError when content is not valid JSON', async () => {
    vi.mocked(readFile).mockResolvedValue('{ broken json');
    await expect(readJsonFile('/bad.json')).rejects.toBeInstanceOf(
      InvalidJsonError,
    );
  });

  it('includes the file path in the InvalidJsonError message', async () => {
    vi.mocked(readFile).mockResolvedValue('not-json');
    await expect(readJsonFile('/bad.json')).rejects.toThrow(/\/bad\.json/);
  });

  it('propagates fs errors verbatim when reading fails', async () => {
    const fsErr = new Error('EACCES');
    vi.mocked(readFile).mockRejectedValue(fsErr);
    await expect(readJsonFile('/locked')).rejects.toBe(fsErr);
  });
});
