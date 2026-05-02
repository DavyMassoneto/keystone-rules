import { describe, it, expect } from 'vitest';
import { renderSection } from '#lib/claude-md';

describe('renderSection', () => {
  it('renders the title as a level-2 heading followed by a blank line and the rules', () => {
    expect(
      renderSection({
        id: 'sec',
        title: 'Section title',
        rules: [{ directive: 'do thing' }],
      }),
    ).toBe(['## Section title', '', '- do thing'].join('\n'));
  });

  it('joins multiple rules with newlines under the same heading', () => {
    expect(
      renderSection({
        id: 'sec',
        title: 'Many',
        rules: [
          { directive: 'first' },
          { directive: 'second' },
          { directive: 'third' },
        ],
      }),
    ).toBe(
      ['## Many', '', '- first', '- second', '- third'].join('\n'),
    );
  });

  it('delegates rendering of rationale and example to renderRule', () => {
    expect(
      renderSection({
        id: 'sec',
        title: 'Mixed',
        rules: [
          { directive: 'plain' },
          { directive: 'with rationale', rationale: 'because' },
        ],
      }),
    ).toBe(
      [
        '## Mixed',
        '',
        '- plain',
        '- with rationale',
        '  > because',
      ].join('\n'),
    );
  });
});
