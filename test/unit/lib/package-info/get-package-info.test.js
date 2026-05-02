import { describe, it, expect } from 'vitest';
import { getPackageInfo } from '#lib';

describe('getPackageInfo', () => {
  it('returns the name, version, and description from the project package.json', () => {
    const info = getPackageInfo();
    expect(info.name).toBe('keystone-rules');
    expect(typeof info.version).toBe('string');
    expect(info.version).toMatch(/^\d+\.\d+\.\d+/);
    expect(typeof info.description).toBe('string');
    expect(info.description.length).toBeGreaterThan(0);
  });
});
