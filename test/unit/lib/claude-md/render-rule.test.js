import { describe, it, expect } from 'vitest';
import { renderRule } from '#lib/claude-md';

describe('renderRule', () => {
  it('renders a directive-only rule as a single bullet line', () => {
    expect(renderRule({ directive: 'do thing' })).toBe('- do thing');
  });

  it('appends an indented blockquote line for the rationale', () => {
    expect(
      renderRule({ directive: 'do thing', rationale: 'because' }),
    ).toBe(['- do thing', '  > because'].join('\n'));
  });

  it('appends the example block under the directive', () => {
    expect(
      renderRule({
        directive: 'do thing',
        example: { bad: 'x', good: 'y' },
      }),
    ).toBe(
      ['- do thing', '    Example:', '    ❌ x', '    ✓ y'].join('\n'),
    );
  });

  it('appends rationale before example when both are present', () => {
    expect(
      renderRule({
        directive: 'do thing',
        rationale: 'because',
        example: { bad: 'x', good: 'y' },
      }),
    ).toBe(
      [
        '- do thing',
        '  > because',
        '    Example:',
        '    ❌ x',
        '    ✓ y',
      ].join('\n'),
    );
  });
});
