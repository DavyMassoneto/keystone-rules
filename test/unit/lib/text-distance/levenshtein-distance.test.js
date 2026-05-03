import { describe, it, expect } from 'vitest';
import { levenshteinDistance } from '#lib/text-distance';

describe('levenshteinDistance', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshteinDistance('abc', 'abc')).toBe(0);
  });

  it('returns 0 for two empty strings', () => {
    expect(levenshteinDistance('', '')).toBe(0);
  });

  it('returns the length of b when a is empty', () => {
    expect(levenshteinDistance('', 'abc')).toBe(3);
  });

  it('returns the length of a when b is empty', () => {
    expect(levenshteinDistance('abc', '')).toBe(3);
  });

  it('counts a single substitution', () => {
    expect(levenshteinDistance('abc', 'abd')).toBe(1);
  });

  it('counts a single insertion', () => {
    expect(levenshteinDistance('abc', 'abcd')).toBe(1);
  });

  it('counts a single deletion', () => {
    expect(levenshteinDistance('abcd', 'abc')).toBe(1);
  });

  it('counts mixed operations (kitten -> sitting)', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
  });

  it('counts mixed operations (saturday -> sunday)', () => {
    expect(levenshteinDistance('saturday', 'sunday')).toBe(3);
  });

  it('is symmetric', () => {
    expect(levenshteinDistance('abc', 'xyz')).toBe(
      levenshteinDistance('xyz', 'abc'),
    );
  });
});
