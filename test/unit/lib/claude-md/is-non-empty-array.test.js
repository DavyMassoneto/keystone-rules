import { describe, it, expect } from 'vitest';
import { isNonEmptyArray } from '#lib/claude-md';

describe('isNonEmptyArray', () => {
  it('returns true for an array with items', () => {
    expect(isNonEmptyArray([1])).toBe(true);
  });

  it('returns false for an empty array', () => {
    expect(isNonEmptyArray([])).toBe(false);
  });

  it('returns false for null', () => {
    expect(isNonEmptyArray(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isNonEmptyArray(undefined)).toBe(false);
  });

  it('returns false for an object', () => {
    expect(isNonEmptyArray({ length: 1 })).toBe(false);
  });

  it('returns false for a string', () => {
    expect(isNonEmptyArray('xy')).toBe(false);
  });
});
