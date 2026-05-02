import { describe, it, expect } from 'vitest';
import { renderTemplate } from '#lib/claude-md';

describe('renderTemplate', () => {
  it('emits the fixed top-level header followed by a blank line and a single section', () => {
    expect(
      renderTemplate({
        version: '1.0.0',
        sections: [
          {
            id: 's',
            title: 'Only',
            rules: [{ directive: 'do thing' }],
          },
        ],
      }),
    ).toBe(
      ['# Agent rules', '', '## Only', '', '- do thing'].join('\n'),
    );
  });

  it('separates multiple sections by a blank line', () => {
    expect(
      renderTemplate({
        version: '1.0.0',
        sections: [
          { id: 'a', title: 'A', rules: [{ directive: 'first' }] },
          { id: 'b', title: 'B', rules: [{ directive: 'second' }] },
        ],
      }),
    ).toBe(
      [
        '# Agent rules',
        '',
        '## A',
        '',
        '- first',
        '',
        '## B',
        '',
        '- second',
      ].join('\n'),
    );
  });

  it('propagates rationale and example formatting through the full pipeline', () => {
    expect(
      renderTemplate({
        version: '1.0.0',
        sections: [
          {
            id: 's',
            title: 'S',
            rules: [
              {
                directive: 'do thing',
                rationale: 'because',
                example: { bad: 'no_op', good: 'do_op' },
              },
            ],
          },
        ],
      }),
    ).toBe(
      [
        '# Agent rules',
        '',
        '## S',
        '',
        '- do thing',
        '  > because',
        '    Example:',
        '    ❌ no_op',
        '    ✓ do_op',
      ].join('\n'),
    );
  });
});
