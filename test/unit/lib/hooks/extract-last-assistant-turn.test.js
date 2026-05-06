import { describe, expect, it } from 'vitest';
import { extractLastAssistantTurn } from '#lib/hooks';

describe('extractLastAssistantTurn', () => {
  it('returns undefined for an empty array', () => {
    expect(extractLastAssistantTurn([])).toBeUndefined();
  });

  it('returns undefined when no event has type assistant', () => {
    expect(
      extractLastAssistantTurn([
        { type: 'user', message: { content: 'hi' } },
        { type: 'summary', summary: 'session summary' },
      ]),
    ).toBeUndefined();
  });

  it('returns the only assistant entry when there is just one', () => {
    const turn = { type: 'assistant', message: { content: 'hello' } };
    expect(extractLastAssistantTurn([turn])).toBe(turn);
  });

  it('returns the LAST assistant entry when there are multiple', () => {
    const first = { type: 'assistant', message: { content: 'first' } };
    const last = { type: 'assistant', message: { content: 'last' } };
    expect(
      extractLastAssistantTurn([
        first,
        { type: 'user', message: { content: 'reply' } },
        last,
      ]),
    ).toBe(last);
  });

  it('skips entries of other types after the last assistant turn', () => {
    const assistantTurn = { type: 'assistant', message: { content: 'hi' } };
    expect(
      extractLastAssistantTurn([
        { type: 'user', message: { content: 'q' } },
        assistantTurn,
        { type: 'user', message: { content: 'q2' } },
        { type: 'summary', summary: 's' },
      ]),
    ).toBe(assistantTurn);
  });

  it('returns the assistant entry verbatim with all original fields preserved', () => {
    const turn = {
      type: 'assistant',
      message: { content: [{ type: 'text', text: 'hi' }] },
      isMeta: false,
      uuid: 'abc-123',
    };
    expect(extractLastAssistantTurn([turn])).toEqual(turn);
  });
});
