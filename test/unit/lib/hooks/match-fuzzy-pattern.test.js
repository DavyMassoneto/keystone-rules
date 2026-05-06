import { describe, it, expect } from 'vitest';
import { matchFuzzyPattern } from '#lib/hooks';

describe('matchFuzzyPattern', () => {
  it('returns true for an exact match between normalized prompt and pattern value', () => {
    const pattern = { type: 'fuzzy', value: 'you are wrong' };
    expect(matchFuzzyPattern('you are wrong', pattern, 0.25)).toBe(true);
  });

  it('returns true when the prompt is within the threshold (single typo)', () => {
    const pattern = { type: 'fuzzy', value: 'you are wrong' };
    expect(matchFuzzyPattern('you arr wrong', pattern, 0.25)).toBe(true);
  });

  it('returns false when the prompt diverges beyond the threshold', () => {
    const pattern = { type: 'fuzzy', value: 'you are wrong' };
    expect(matchFuzzyPattern('the weather today', pattern, 0.25)).toBe(false);
  });

  it('detects the pattern embedded in a longer prompt via sliding window', () => {
    const pattern = { type: 'fuzzy', value: 'you are wrong' };
    expect(
      matchFuzzyPattern('actually i think you are wrong here', pattern, 0.25),
    ).toBe(true);
  });

  it('normalizes the pattern value before comparison', () => {
    const pattern = { type: 'fuzzy', value: 'NÃO faz sentido' };
    expect(matchFuzzyPattern('nao faz sentido', pattern, 0)).toBe(true);
  });

  it('returns false when the normalized prompt is shorter than the pattern', () => {
    const pattern = { type: 'fuzzy', value: 'you are wrong' };
    expect(matchFuzzyPattern('no', pattern, 0.25)).toBe(false);
  });

  it('returns false for an unrelated prompt of similar length', () => {
    const pattern = { type: 'fuzzy', value: 'you are wrong' };
    expect(matchFuzzyPattern('the cat is here', pattern, 0.25)).toBe(false);
  });
});
