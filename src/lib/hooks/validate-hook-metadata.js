import { InvalidHookConfigError } from '#lib/errors';
import { isNonEmptyString } from '#lib/shared';

export function validateHookMetadata(config) {
  if (!isNonEmptyString(config.version)) {
    throw new InvalidHookConfigError(
      'Invalid hook config: version must be a non-empty string',
    );
  }
  if (!isNonEmptyString(config.name)) {
    throw new InvalidHookConfigError(
      'Invalid hook config: name must be a non-empty string',
    );
  }
  if (!isNonEmptyString(config.description)) {
    throw new InvalidHookConfigError(
      'Invalid hook config: description must be a non-empty string',
    );
  }
}
