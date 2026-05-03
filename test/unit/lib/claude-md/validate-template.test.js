import { describe, it, expect } from 'vitest';
import { InvalidTemplateError } from '#lib';
import { validateTemplate } from '#lib/claude-md';

const validTemplate = {
  version: '1.0.0',
  sections: [
    {
      id: 'sec',
      title: 'Sec',
      rules: [{ directive: 'do thing' }],
    },
  ],
};

describe('validateTemplate', () => {
  it('returns the same template object on success (identity preserved)', () => {
    const result = validateTemplate(validTemplate);
    expect(result).toBe(validTemplate);
  });

  it('accepts a rule with a rationale', () => {
    const tpl = {
      version: '1.0.0',
      sections: [
        {
          id: 'sec',
          title: 'Sec',
          rules: [{ directive: 'do thing', rationale: 'because' }],
        },
      ],
    };
    expect(validateTemplate(tpl)).toBe(tpl);
  });

  it('accepts a rule with an example', () => {
    const tpl = {
      version: '1.0.0',
      sections: [
        {
          id: 'sec',
          title: 'Sec',
          rules: [
            { directive: 'do thing', example: { bad: 'x', good: 'y' } },
          ],
        },
      ],
    };
    expect(validateTemplate(tpl)).toBe(tpl);
  });

  it('throws when template is null', () => {
    expect(() => validateTemplate(null)).toThrow(InvalidTemplateError);
    expect(() => validateTemplate(null)).toThrow(
      'Invalid template: must be a non-null object',
    );
  });

  it('throws when template is not an object', () => {
    expect(() => validateTemplate('string')).toThrow(InvalidTemplateError);
    expect(() => validateTemplate('string')).toThrow(
      'Invalid template: must be a non-null object',
    );
  });

  it('throws when version is missing', () => {
    expect(() => validateTemplate({ sections: [] })).toThrow(
      'Invalid template: version must be a non-empty string',
    );
  });

  it('throws when version is empty string', () => {
    expect(() =>
      validateTemplate({ version: '', sections: [] }),
    ).toThrow('Invalid template: version must be a non-empty string');
  });

  it('throws when version is not a string', () => {
    expect(() =>
      validateTemplate({ version: 1, sections: [] }),
    ).toThrow('Invalid template: version must be a non-empty string');
  });

  it('throws when sections is not an array', () => {
    expect(() =>
      validateTemplate({ version: '1.0.0', sections: 'no' }),
    ).toThrow('Invalid template: sections must be a non-empty array');
  });

  it('throws when sections is empty', () => {
    expect(() =>
      validateTemplate({ version: '1.0.0', sections: [] }),
    ).toThrow('Invalid template: sections must be a non-empty array');
  });

  it('throws when a section is not an object', () => {
    expect(() =>
      validateTemplate({ version: '1.0.0', sections: ['nope'] }),
    ).toThrow('Invalid template: sections[0] must be an object');
  });

  it('throws when a section is null', () => {
    expect(() =>
      validateTemplate({ version: '1.0.0', sections: [null] }),
    ).toThrow('Invalid template: sections[0] must be an object');
  });

  it('throws when a section id is missing', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [{ title: 'T', rules: [{ directive: 'd' }] }],
      }),
    ).toThrow('Invalid template: sections[0].id must be a non-empty string');
  });

  it('throws when a section id is empty', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [{ id: '', title: 'T', rules: [{ directive: 'd' }] }],
      }),
    ).toThrow('Invalid template: sections[0].id must be a non-empty string');
  });

  it('throws when a section title is missing', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [{ id: 's', rules: [{ directive: 'd' }] }],
      }),
    ).toThrow(
      'Invalid template: sections[0].title must be a non-empty string',
    );
  });

  it('throws when a section title is empty', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [{ id: 's', title: '', rules: [{ directive: 'd' }] }],
      }),
    ).toThrow(
      'Invalid template: sections[0].title must be a non-empty string',
    );
  });

  it('throws when section rules is not an array', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [{ id: 's', title: 'T', rules: 'no' }],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules must be a non-empty array',
    );
  });

  it('throws when section rules is empty', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [{ id: 's', title: 'T', rules: [] }],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules must be a non-empty array',
    );
  });

  it('throws when a rule is not an object', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [{ id: 's', title: 'T', rules: ['nope'] }],
      }),
    ).toThrow('Invalid template: sections[0].rules[0] must be an object');
  });

  it('throws when a rule is null', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [{ id: 's', title: 'T', rules: [null] }],
      }),
    ).toThrow('Invalid template: sections[0].rules[0] must be an object');
  });

  it('throws when rule directive is missing', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [{ id: 's', title: 'T', rules: [{}] }],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules[0].directive must be a non-empty string',
    );
  });

  it('throws when rule directive is empty', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [{ id: 's', title: 'T', rules: [{ directive: '' }] }],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules[0].directive must be a non-empty string',
    );
  });

  it('throws when rule rationale is present but not a string', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [
          {
            id: 's',
            title: 'T',
            rules: [{ directive: 'd', rationale: 7 }],
          },
        ],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules[0].rationale must be a non-empty string',
    );
  });

  it('throws when rule rationale is empty string', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [
          {
            id: 's',
            title: 'T',
            rules: [{ directive: 'd', rationale: '' }],
          },
        ],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules[0].rationale must be a non-empty string',
    );
  });

  it('throws when rule example is present but not an object', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [
          {
            id: 's',
            title: 'T',
            rules: [{ directive: 'd', example: 'no' }],
          },
        ],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules[0].example must be an object',
    );
  });

  it('throws when rule example is null', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [
          {
            id: 's',
            title: 'T',
            rules: [{ directive: 'd', example: null }],
          },
        ],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules[0].example must be an object',
    );
  });

  it('throws when rule example.bad is missing', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [
          {
            id: 's',
            title: 'T',
            rules: [{ directive: 'd', example: { good: 'y' } }],
          },
        ],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules[0].example.bad must be a non-empty string',
    );
  });

  it('throws when rule example.bad is empty', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [
          {
            id: 's',
            title: 'T',
            rules: [{ directive: 'd', example: { bad: '', good: 'y' } }],
          },
        ],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules[0].example.bad must be a non-empty string',
    );
  });

  it('throws when rule example.good is missing', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [
          {
            id: 's',
            title: 'T',
            rules: [{ directive: 'd', example: { bad: 'x' } }],
          },
        ],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules[0].example.good must be a non-empty string',
    );
  });

  it('throws when rule example.good is empty', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [
          {
            id: 's',
            title: 'T',
            rules: [{ directive: 'd', example: { bad: 'x', good: '' } }],
          },
        ],
      }),
    ).toThrow(
      'Invalid template: sections[0].rules[0].example.good must be a non-empty string',
    );
  });

  it('reports the correct path for second section invalid rule', () => {
    expect(() =>
      validateTemplate({
        version: '1.0.0',
        sections: [
          { id: 's1', title: 'T1', rules: [{ directive: 'd' }] },
          { id: 's2', title: 'T2', rules: [{}] },
        ],
      }),
    ).toThrow(
      'Invalid template: sections[1].rules[0].directive must be a non-empty string',
    );
  });
});
