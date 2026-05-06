import { describe, it, expect } from 'vitest';
import { detectPressure } from '#lib/hooks';

const baseConfig = () => ({
  patterns: [
    { type: 'fuzzy', value: 'you are wrong' },
    { type: 'regex', value: '!{3,}' },
    { type: 'regex', value: '\\b(ERRADO|PROIBIDO|NUNCA|JAMAIS)\\b' },
  ],
  fuzzyThreshold: 0.25,
});

describe('detectPressure', () => {
  it('returns true when a fuzzy pattern matches exactly', () => {
    expect(detectPressure('you are wrong', baseConfig())).toBe(true);
  });

  it('returns true when a fuzzy pattern matches within the threshold', () => {
    expect(detectPressure('you arr wrong', baseConfig())).toBe(true);
  });

  it('returns false when a fuzzy pattern only matches above the threshold', () => {
    expect(detectPressure('today is sunny', baseConfig())).toBe(false);
  });

  it('detects a fuzzy pattern embedded in a longer prompt via sliding window', () => {
    expect(
      detectPressure('actually i think you are wrong here', baseConfig()),
    ).toBe(true);
  });

  it('returns true when the prompt triggers a structural regex pattern', () => {
    expect(detectPressure('this is broken!!!', baseConfig())).toBe(true);
  });

  it('returns true when the prompt triggers a capitalization regex pattern', () => {
    expect(detectPressure('isso é PROIBIDO aqui', baseConfig())).toBe(true);
  });

  it('returns false when the prompt is clean of every pattern', () => {
    expect(detectPressure('please review this diff', baseConfig())).toBe(false);
  });

  it('matches fuzzy patterns regardless of accents, casing, and punctuation', () => {
    const config = {
      patterns: [{ type: 'fuzzy', value: 'isso nao faz sentido' }],
      fuzzyThreshold: 0.25,
    };
    expect(detectPressure('  ISSO,    NÃO  faz   SENTIDO!!! ', config)).toBe(
      true,
    );
  });

  it('short-circuits on the first matching pattern without inspecting later ones', () => {
    const config = {
      patterns: [
        { type: 'fuzzy', value: 'you are wrong' },
        { type: 'regex', value: '[unterminated' },
      ],
      fuzzyThreshold: 0.25,
    };
    expect(() => detectPressure('you are wrong', config)).not.toThrow();
  });
});
