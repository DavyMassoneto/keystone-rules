import { describe, it, expect } from 'vitest';
import { InvalidTemplateError } from '#lib';
import { validateRuleExample } from '#lib/claude-md';

const PATH = 'sections[0].rules[0].example';

describe('validateRuleExample', () => {
  it('does not throw for a valid example', () => {
    expect(() =>
      validateRuleExample({ bad: 'x', good: 'y' }, PATH),
    ).not.toThrow();
  });

  it('throws InvalidTemplateError when example is not an object', () => {
    expect(() => validateRuleExample('no', PATH)).toThrow(
      InvalidTemplateError,
    );
    expect(() => validateRuleExample('no', PATH)).toThrow(
      `Invalid template: ${PATH} must be an object`,
    );
  });

  it('throws when example is null', () => {
    expect(() => validateRuleExample(null, PATH)).toThrow(
      `Invalid template: ${PATH} must be an object`,
    );
  });

  it('throws when example is an array', () => {
    expect(() => validateRuleExample([], PATH)).toThrow(
      `Invalid template: ${PATH} must be an object`,
    );
  });

  it('throws when bad is missing', () => {
    expect(() => validateRuleExample({ good: 'y' }, PATH)).toThrow(
      `Invalid template: ${PATH}.bad must be a non-empty string`,
    );
  });

  it('throws when bad is empty', () => {
    expect(() =>
      validateRuleExample({ bad: '', good: 'y' }, PATH),
    ).toThrow(`Invalid template: ${PATH}.bad must be a non-empty string`);
  });

  it('throws when good is missing', () => {
    expect(() => validateRuleExample({ bad: 'x' }, PATH)).toThrow(
      `Invalid template: ${PATH}.good must be a non-empty string`,
    );
  });

  it('throws when good is empty', () => {
    expect(() =>
      validateRuleExample({ bad: 'x', good: '' }, PATH),
    ).toThrow(`Invalid template: ${PATH}.good must be a non-empty string`);
  });
});
