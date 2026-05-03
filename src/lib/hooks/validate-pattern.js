import { InvalidHookConfigError } from '#lib/errors';
import { isNonEmptyString, isObject } from '#lib/shared';
import { validateRegexValue } from './validate-regex-value.js';

export function validatePattern(pattern, path) {
  if (!isObject(pattern)) {
    throw new InvalidHookConfigError(
      `Invalid hook config: ${path} must be an object`,
    );
  }
  if (pattern.type !== 'fuzzy' && pattern.type !== 'regex') {
    throw new InvalidHookConfigError(
      `Invalid hook config: ${path}.type must be "fuzzy" or "regex"`,
    );
  }
  if (!isNonEmptyString(pattern.value)) {
    throw new InvalidHookConfigError(
      `Invalid hook config: ${path}.value must be a non-empty string`,
    );
  }
  if (pattern.label !== undefined && !isNonEmptyString(pattern.label)) {
    throw new InvalidHookConfigError(
      `Invalid hook config: ${path}.label must be a non-empty string`,
    );
  }
  if (pattern.type === 'regex') {
    validateRegexValue(pattern.value, path);
  }
}
