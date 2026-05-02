import { describe, it, expect } from 'vitest';
import { parse } from '#lib';

describe('parse', () => {
  it('returns an empty result when argv is empty', () => {
    expect(parse([])).toEqual({ command: null, flags: {}, positional: [] });
  });

  it('treats the first positional argument as the command', () => {
    expect(parse(['install'])).toEqual({
      command: 'install',
      flags: {},
      positional: [],
    });
  });

  it('parses a long boolean flag', () => {
    expect(parse(['install', '--force'])).toEqual({
      command: 'install',
      flags: { force: true },
      positional: [],
    });
  });

  it('parses --no-flag as boolean false with the no- prefix stripped', () => {
    expect(parse(['install', '--no-force'])).toEqual({
      command: 'install',
      flags: { force: false },
      positional: [],
    });
  });

  it('parses --flag=value with explicit value', () => {
    expect(parse(['install', '--output=./dist'])).toEqual({
      command: 'install',
      flags: { output: './dist' },
      positional: [],
    });
  });

  it('does not consume the next argument as value (no space syntax)', () => {
    expect(parse(['install', '--force', 'skill'])).toEqual({
      command: 'install',
      flags: { force: true },
      positional: ['skill'],
    });
  });

  it('combines --flag=value with positional', () => {
    expect(parse(['install', '--name=foo', 'skill'])).toEqual({
      command: 'install',
      flags: { name: 'foo' },
      positional: ['skill'],
    });
  });

  it('parses a short flag as boolean true', () => {
    expect(parse(['install', '-f'])).toEqual({
      command: 'install',
      flags: { f: true },
      positional: [],
    });
  });

  it('parses a short flag with =value', () => {
    expect(parse(['install', '-o=./dist'])).toEqual({
      command: 'install',
      flags: { o: './dist' },
      positional: [],
    });
  });

  it('captures a leading flag when no command is provided', () => {
    expect(parse(['--help'])).toEqual({
      command: null,
      flags: { help: true },
      positional: [],
    });
  });
});
