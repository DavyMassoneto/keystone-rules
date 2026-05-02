import { describe, it, expect } from 'vitest';
import { isObject } from '#lib/claude-md';

describe('isObject', () => {
  it('returns true for a plain object', () => {
    expect(isObject({})).toBe(true);
  });

  it('returns true for an object with properties', () => {
    expect(isObject({ a: 1 })).toBe(true);
  });

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isObject(undefined)).toBe(false);
  });

  it('returns false for an array', () => {
    expect(isObject([])).toBe(false);
  });

  it('returns false for a string', () => {
    expect(isObject('x')).toBe(false);
  });

  it('returns false for a number', () => {
    expect(isObject(0)).toBe(false);
  });

  it('returns false for a boolean', () => {
    expect(isObject(true)).toBe(false);
  });
});
