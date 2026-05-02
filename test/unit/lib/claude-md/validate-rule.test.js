import { describe, it, expect } from 'vitest';
import { InvalidTemplateError } from '#lib';
import { validateRule } from '#lib/claude-md';

const PATH = 'sections[0].rules[0]';

describe('validateRule', () => {
  it('does not throw for a directive-only rule', () => {
    expect(() => validateRule({ directive: 'do thing' }, PATH)).not.toThrow();
  });

  it('does not throw for a rule with a rationale', () => {
    expect(() =>
      validateRule({ directive: 'do thing', rationale: 'because' }, PATH),
    ).not.toThrow();
  });

  it('does not throw for a rule with an example', () => {
    expect(() =>
      validateRule(
        { directive: 'do thing', example: { bad: 'x', good: 'y' } },
        PATH,
      ),
    ).not.toThrow();
  });

  it('throws InvalidTemplateError when rule is not an object', () => {
    expect(() => validateRule('no', PATH)).toThrow(InvalidTemplateError);
    expect(() => validateRule('no', PATH)).toThrow(
      `Invalid template: ${PATH} must be an object`,
    );
  });

  it('throws when rule is null', () => {
    expect(() => validateRule(null, PATH)).toThrow(
      `Invalid template: ${PATH} must be an object`,
    );
  });

  it('throws when directive is missing', () => {
    expect(() => validateRule({}, PATH)).toThrow(
      `Invalid template: ${PATH}.directive must be a non-empty string`,
    );
  });

  it('throws when directive is empty', () => {
    expect(() => validateRule({ directive: '' }, PATH)).toThrow(
      `Invalid template: ${PATH}.directive must be a non-empty string`,
    );
  });

  it('throws when rationale is present but not a string', () => {
    expect(() =>
      validateRule({ directive: 'd', rationale: 7 }, PATH),
    ).toThrow(
      `Invalid template: ${PATH}.rationale must be a non-empty string`,
    );
  });

  it('throws when rationale is empty', () => {
    expect(() =>
      validateRule({ directive: 'd', rationale: '' }, PATH),
    ).toThrow(
      `Invalid template: ${PATH}.rationale must be a non-empty string`,
    );
  });

  it('delegates example validation and propagates the error path', () => {
    expect(() =>
      validateRule({ directive: 'd', example: { bad: 'x' } }, PATH),
    ).toThrow(
      `Invalid template: ${PATH}.example.good must be a non-empty string`,
    );
  });
});
