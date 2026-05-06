import { InvalidTemplateError } from '#lib/errors';
import { isNonEmptyArray, isNonEmptyString, isObject } from '#lib/shared';
import { validateRule } from './validate-rule.js';

export function validateSection(section, path) {
  if (!isObject(section)) {
    throw new InvalidTemplateError(
      `Invalid template: ${path} must be an object`,
    );
  }
  if (!isNonEmptyString(section.id)) {
    throw new InvalidTemplateError(
      `Invalid template: ${path}.id must be a non-empty string`,
    );
  }
  if (!isNonEmptyString(section.title)) {
    throw new InvalidTemplateError(
      `Invalid template: ${path}.title must be a non-empty string`,
    );
  }
  if (!isNonEmptyArray(section.rules)) {
    throw new InvalidTemplateError(
      `Invalid template: ${path}.rules must be a non-empty array`,
    );
  }
  for (let i = 0; i < section.rules.length; i++) {
    validateRule(section.rules[i], `${path}.rules[${i}]`);
  }
}
