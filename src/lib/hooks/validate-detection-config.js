import { InvalidHookConfigError } from '#lib/errors';
import { isNonEmptyArray } from '#lib/shared';
import { validatePattern } from './validate-pattern.js';

export function validateDetectionConfig(config) {
  if (!isNonEmptyArray(config.patterns)) {
    throw new InvalidHookConfigError(
      'Invalid hook config: patterns must be a non-empty array',
    );
  }
  for (let i = 0; i < config.patterns.length; i++) {
    validatePattern(config.patterns[i], `patterns[${i}]`);
  }
  if (
    typeof config.fuzzyThreshold !== 'number' ||
    config.fuzzyThreshold < 0 ||
    config.fuzzyThreshold > 1
  ) {
    throw new InvalidHookConfigError(
      'Invalid hook config: fuzzyThreshold must be a number between 0 and 1',
    );
  }
}
