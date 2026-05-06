import { describe, it, expect } from 'vitest';
import { InvalidHookConfigError } from '#lib';
import { validatePattern } from '#lib/hooks';

const PATH = 'patterns[0]';

describe('validatePattern', () => {
  it('does not throw for a valid fuzzy pattern', () => {
    expect(() =>
      validatePattern({ type: 'fuzzy', value: 'you are wrong' }, PATH),
    ).not.toThrow();
  });

  it('does not throw for a valid regex pattern', () => {
    expect(() =>
      validatePattern({ type: 'regex', value: '!{3,}' }, PATH),
    ).not.toThrow();
  });

  it('does not throw when an optional label is provided', () => {
    expect(() =>
      validatePattern(
        { type: 'fuzzy', value: 'stop doing', label: 'en-stop' },
        PATH,
      ),
    ).not.toThrow();
  });

  it('throws InvalidHookConfigError when pattern is not an object', () => {
    expect(() => validatePattern('nope', PATH)).toThrow(InvalidHookConfigError);
    expect(() => validatePattern('nope', PATH)).toThrow(
      `Invalid hook config: ${PATH} must be an object`,
    );
  });

  it('throws when pattern is null', () => {
    expect(() => validatePattern(null, PATH)).toThrow(
      `Invalid hook config: ${PATH} must be an object`,
    );
  });

  it('throws when type is missing', () => {
    expect(() => validatePattern({ value: 'x' }, PATH)).toThrow(
      `Invalid hook config: ${PATH}.type must be "fuzzy" or "regex"`,
    );
  });

  it('throws when type is neither fuzzy nor regex', () => {
    expect(() => validatePattern({ type: 'glob', value: 'x' }, PATH)).toThrow(
      `Invalid hook config: ${PATH}.type must be "fuzzy" or "regex"`,
    );
  });

  it('throws when value is missing', () => {
    expect(() => validatePattern({ type: 'fuzzy' }, PATH)).toThrow(
      `Invalid hook config: ${PATH}.value must be a non-empty string`,
    );
  });

  it('throws when value is empty', () => {
    expect(() =>
      validatePattern({ type: 'regex', value: '' }, PATH),
    ).toThrow(
      `Invalid hook config: ${PATH}.value must be a non-empty string`,
    );
  });

  it('throws when label is present but not a string', () => {
    expect(() =>
      validatePattern({ type: 'fuzzy', value: 'x', label: 7 }, PATH),
    ).toThrow(
      `Invalid hook config: ${PATH}.label must be a non-empty string`,
    );
  });

  it('throws when label is empty', () => {
    expect(() =>
      validatePattern({ type: 'fuzzy', value: 'x', label: '' }, PATH),
    ).toThrow(
      `Invalid hook config: ${PATH}.label must be a non-empty string`,
    );
  });

  it('throws when regex value is not a valid regular expression', () => {
    expect(() =>
      validatePattern({ type: 'regex', value: '[unterminated' }, PATH),
    ).toThrow(
      `Invalid hook config: ${PATH}.value must be a valid regular expression`,
    );
  });
});
