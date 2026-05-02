import { describe, it, expect } from 'vitest';
import { isNonEmptyString } from '#lib/claude-md';

describe('isNonEmptyString', () => {
  it('returns true for a non-empty string', () => {
    expect(isNonEmptyString('hello')).toBe(true);
  });

  it('returns false for an empty string', () => {
    expect(isNonEmptyString('')).toBe(false);
  });

  it('returns false for a number', () => {
    expect(isNonEmptyString(7)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isNonEmptyString(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isNonEmptyString(undefined)).toBe(false);
  });

  it('returns false for an object', () => {
    expect(isNonEmptyString({})).toBe(false);
  });

  it('returns false for an array', () => {
    expect(isNonEmptyString([])).toBe(false);
  });
});
