import { InvalidTemplateError } from '#lib/errors';
import { isNonEmptyString } from './is-non-empty-string.js';
import { isObject } from './is-object.js';

export function validateRuleExample(example, path) {
  if (!isObject(example)) {
    throw new InvalidTemplateError(
      `Invalid template: ${path} must be an object`,
    );
  }
  if (!isNonEmptyString(example.bad)) {
    throw new InvalidTemplateError(
      `Invalid template: ${path}.bad must be a non-empty string`,
    );
  }
  if (!isNonEmptyString(example.good)) {
    throw new InvalidTemplateError(
      `Invalid template: ${path}.good must be a non-empty string`,
    );
  }
}
