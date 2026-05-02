import { describe, it, expect } from 'vitest';
import { renderRuleExample } from '#lib/claude-md';

describe('renderRuleExample', () => {
  it('renders bad and good lines indented with 4 spaces under an Example: header', () => {
    expect(renderRuleExample({ bad: 'no_op', good: 'do_op' })).toBe(
      ['    Example:', '    ❌ no_op', '    ✓ do_op'].join('\n'),
    );
  });

  it('preserves the literal content of bad and good without escaping', () => {
    expect(renderRuleExample({ bad: 'a < b', good: 'a > b' })).toBe(
      ['    Example:', '    ❌ a < b', '    ✓ a > b'].join('\n'),
    );
  });
});
