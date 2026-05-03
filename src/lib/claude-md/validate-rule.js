import { InvalidTemplateError } from '#lib/errors';
import { isNonEmptyString } from './is-non-empty-string.js';
import { isObject } from './is-object.js';
import { validateRuleExample } from './validate-rule-example.js';

export function validateRule(rule, path) {
  if (!isObject(rule)) {
    throw new InvalidTemplateError(
      `Invalid template: ${path} must be an object`,
    );
  }
  if (!isNonEmptyString(rule.directive)) {
    throw new InvalidTemplateError(
      `Invalid template: ${path}.directive must be a non-empty string`,
    );
  }
  if (rule.rationale !== undefined && !isNonEmptyString(rule.rationale)) {
    throw new InvalidTemplateError(
      `Invalid template: ${path}.rationale must be a non-empty string`,
    );
  }
  if (rule.example !== undefined) {
    validateRuleExample(rule.example, `${path}.example`);
  }
}
