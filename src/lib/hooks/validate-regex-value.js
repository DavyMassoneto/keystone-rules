import { InvalidHookConfigError } from '#lib/errors';

export function validateRegexValue(value, path) {
  try {
    new RegExp(value);
  } catch {
    throw new InvalidHookConfigError(
      `Invalid hook config: ${path}.value must be a valid regular expression`,
    );
  }
}
