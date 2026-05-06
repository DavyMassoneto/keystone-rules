import { describe, it, expect } from 'vitest';
import { InvalidHookConfigError } from '#lib';
import { validateRegexValue } from '#lib/hooks';

const PATH = 'patterns[0]';

describe('validateRegexValue', () => {
  it('does not throw for a valid regex', () => {
    expect(() => validateRegexValue('!{3,}', PATH)).not.toThrow();
  });

  it('does not throw for a regex with character classes', () => {
    expect(() =>
      validateRegexValue('\\b(ERRADO|PROIBIDO)\\b', PATH),
    ).not.toThrow();
  });

  it('throws InvalidHookConfigError when the regex cannot be compiled', () => {
    expect(() => validateRegexValue('[unterminated', PATH)).toThrow(
      InvalidHookConfigError,
    );
    expect(() => validateRegexValue('[unterminated', PATH)).toThrow(
      `Invalid hook config: ${PATH}.value must be a valid regular expression`,
    );
  });
});
