import { describe, it, expect } from 'vitest';
import { formatHookContext } from '#lib/hooks';

describe('formatHookContext', () => {
  it('returns a JSON string with the official UserPromptSubmit shape', () => {
    const result = formatHookContext('STOP. Do not capitulate.');
    expect(JSON.parse(result)).toEqual({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: 'STOP. Do not capitulate.',
      },
    });
  });

  it('preserves the reminder text verbatim including line breaks', () => {
    const reminder = 'line one\nline two';
    const parsed = JSON.parse(formatHookContext(reminder));
    expect(parsed.hookSpecificOutput.additionalContext).toBe(reminder);
  });
});
