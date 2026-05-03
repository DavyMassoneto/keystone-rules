import { InvalidHookConfigError } from '#lib/errors';
import { isNonEmptyString } from '#lib/shared';

export function validateHookResponse(config) {
  if (!isNonEmptyString(config.reminder)) {
    throw new InvalidHookConfigError(
      'Invalid hook config: reminder must be a non-empty string',
    );
  }
}
