import { InvalidTemplateError } from '#lib/errors';
import { isNonEmptyArray } from './is-non-empty-array.js';
import { isNonEmptyString } from './is-non-empty-string.js';
import { isObject } from './is-object.js';
import { validateSection } from './validate-section.js';

export function validateTemplate(template) {
  if (!isObject(template)) {
    throw new InvalidTemplateError(
      'Invalid template: must be a non-null object',
    );
  }
  if (!isNonEmptyString(template.version)) {
    throw new InvalidTemplateError(
      'Invalid template: version must be a non-empty string',
    );
  }
  if (!isNonEmptyArray(template.sections)) {
    throw new InvalidTemplateError(
      'Invalid template: sections must be a non-empty array',
    );
  }
  for (let i = 0; i < template.sections.length; i++) {
    validateSection(template.sections[i], `sections[${i}]`);
  }
  return template;
}
