import { describe, it, expect } from 'vitest';
import { InvalidHookConfigError } from '#lib';
import { validateHookResponse } from '#lib/hooks';

describe('validateHookResponse', () => {
  it('does not throw for a config with a non-empty reminder', () => {
    expect(() =>
      validateHookResponse({ reminder: 'STOP. Do not capitulate.' }),
    ).not.toThrow();
  });

  it('throws InvalidHookConfigError when reminder is missing', () => {
    expect(() => validateHookResponse({})).toThrow(InvalidHookConfigError);
    expect(() => validateHookResponse({})).toThrow(
      'Invalid hook config: reminder must be a non-empty string',
    );
  });

  it('throws when reminder is empty', () => {
    expect(() => validateHookResponse({ reminder: '' })).toThrow(
      'Invalid hook config: reminder must be a non-empty string',
    );
  });

  it('throws when reminder is not a string', () => {
    expect(() => validateHookResponse({ reminder: 7 })).toThrow(
      'Invalid hook config: reminder must be a non-empty string',
    );
  });
});
