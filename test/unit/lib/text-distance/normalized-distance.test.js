import { describe, it, expect } from 'vitest';
import { normalizedDistance } from '#lib/text-distance';

describe('normalizedDistance', () => {
  it('returns 0 for identical strings', () => {
    expect(normalizedDistance('abc', 'abc')).toBe(0);
  });

  it('returns 0 for two empty strings', () => {
    expect(normalizedDistance('', '')).toBe(0);
  });

  it('returns 1 when only one of the strings is empty', () => {
    expect(normalizedDistance('', 'abc')).toBe(1);
    expect(normalizedDistance('abc', '')).toBe(1);
  });

  it('returns 1 for completely different strings of equal length', () => {
    expect(normalizedDistance('abc', 'xyz')).toBe(1);
  });

  it('returns a value between 0 and 1 for partial matches', () => {
    const distance = normalizedDistance('kitten', 'sitting');
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(1);
  });

  it('divides Levenshtein distance by the length of the longer string', () => {
    expect(normalizedDistance('abc', 'abcd')).toBeCloseTo(0.25);
  });
});
