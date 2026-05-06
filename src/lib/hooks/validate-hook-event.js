import { InvalidHookConfigError } from '#lib/errors';
import { isNonEmptyString, isObject } from '#lib/shared';

export function validateHookEvent(event) {
  if (!isObject(event)) {
    throw new InvalidHookConfigError(
      'Invalid hook event: must be a non-null object',
    );
  }
  if (!isNonEmptyString(event.prompt)) {
    throw new InvalidHookConfigError(
      'Invalid hook event: prompt must be a non-empty string',
    );
  }
  if (event.hook_event_name !== 'UserPromptSubmit') {
    throw new InvalidHookConfigError(
      'Invalid hook event: hook_event_name must be "UserPromptSubmit"',
    );
  }
  return event;
}
