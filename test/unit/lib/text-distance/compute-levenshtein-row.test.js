import { describe, it, expect } from 'vitest';
import { computeLevenshteinRow } from '#lib/text-distance';

describe('computeLevenshteinRow', () => {
  it('returns a single-element row when target is empty', () => {
    expect(computeLevenshteinRow([0], 'x', '')).toEqual([1]);
  });

  it('inherits the previous row first column incremented by 1', () => {
    expect(computeLevenshteinRow([5, 6, 7], 'a', 'ab')[0]).toBe(6);
  });

  it('uses substitution cost 0 when source char matches the target char', () => {
    expect(computeLevenshteinRow([0, 1, 2, 3], 'a', 'abc')).toEqual([1, 0, 1, 2]);
  });

  it('charges +1 across the row when source char does not match any target char', () => {
    expect(computeLevenshteinRow([0, 1, 2, 3], 'z', 'abc')).toEqual([1, 1, 2, 3]);
  });

  it('builds the second row correctly when called after the first row', () => {
    const firstRow = computeLevenshteinRow([0, 1, 2, 3], 'a', 'abc');
    expect(computeLevenshteinRow(firstRow, 'b', 'abc')).toEqual([2, 1, 0, 1]);
  });
});
