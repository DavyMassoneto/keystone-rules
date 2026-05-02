import { describe, it, expect } from 'vitest';
import { InvalidTemplateError } from '#lib';
import { validateSection } from '#lib/claude-md';

const PATH = 'sections[0]';

const validSection = {
  id: 'sec',
  title: 'Sec',
  rules: [{ directive: 'do thing' }],
};

describe('validateSection', () => {
  it('does not throw for a valid section', () => {
    expect(() => validateSection(validSection, PATH)).not.toThrow();
  });

  it('throws InvalidTemplateError when section is not an object', () => {
    expect(() => validateSection('no', PATH)).toThrow(InvalidTemplateError);
    expect(() => validateSection('no', PATH)).toThrow(
      `Invalid template: ${PATH} must be an object`,
    );
  });

  it('throws when section is null', () => {
    expect(() => validateSection(null, PATH)).toThrow(
      `Invalid template: ${PATH} must be an object`,
    );
  });

  it('throws when id is missing', () => {
    expect(() =>
      validateSection({ title: 'T', rules: [{ directive: 'd' }] }, PATH),
    ).toThrow(`Invalid template: ${PATH}.id must be a non-empty string`);
  });

  it('throws when id is empty', () => {
    expect(() =>
      validateSection(
        { id: '', title: 'T', rules: [{ directive: 'd' }] },
        PATH,
      ),
    ).toThrow(`Invalid template: ${PATH}.id must be a non-empty string`);
  });

  it('throws when title is missing', () => {
    expect(() =>
      validateSection({ id: 's', rules: [{ directive: 'd' }] }, PATH),
    ).toThrow(`Invalid template: ${PATH}.title must be a non-empty string`);
  });

  it('throws when title is empty', () => {
    expect(() =>
      validateSection(
        { id: 's', title: '', rules: [{ directive: 'd' }] },
        PATH,
      ),
    ).toThrow(`Invalid template: ${PATH}.title must be a non-empty string`);
  });

  it('throws when rules is not an array', () => {
    expect(() =>
      validateSection({ id: 's', title: 'T', rules: 'no' }, PATH),
    ).toThrow(`Invalid template: ${PATH}.rules must be a non-empty array`);
  });

  it('throws when rules is empty', () => {
    expect(() =>
      validateSection({ id: 's', title: 'T', rules: [] }, PATH),
    ).toThrow(`Invalid template: ${PATH}.rules must be a non-empty array`);
  });

  it('delegates rule validation and propagates the indexed error path', () => {
    expect(() =>
      validateSection(
        {
          id: 's',
          title: 'T',
          rules: [{ directive: 'ok' }, { directive: '' }],
        },
        PATH,
      ),
    ).toThrow(
      `Invalid template: ${PATH}.rules[1].directive must be a non-empty string`,
    );
  });
});
