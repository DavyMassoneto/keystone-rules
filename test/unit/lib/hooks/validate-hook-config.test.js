import { describe, it, expect } from 'vitest';
import { InvalidHookConfigError } from '#lib';
import { validateHookConfig } from '#lib/hooks';

const baseConfig = () => ({
  version: '1.0.0',
  name: 'davy-anti-capitulation',
  description: 'detects social pressure',
  patterns: [{ type: 'fuzzy', value: 'you are wrong' }],
  fuzzyThreshold: 0.25,
  reminder: 'STOP. Do not capitulate.',
});

describe('validateHookConfig', () => {
  it('returns the config when valid', () => {
    const config = baseConfig();
    expect(validateHookConfig(config)).toBe(config);
  });

  it('throws InvalidHookConfigError when config is not an object', () => {
    expect(() => validateHookConfig('nope')).toThrow(InvalidHookConfigError);
    expect(() => validateHookConfig('nope')).toThrow(
      'Invalid hook config: must be a non-null object',
    );
  });

  it('throws when config is null', () => {
    expect(() => validateHookConfig(null)).toThrow(
      'Invalid hook config: must be a non-null object',
    );
  });

  it('delegates metadata validation', () => {
    const config = baseConfig();
    delete config.version;
    expect(() => validateHookConfig(config)).toThrow(
      'Invalid hook config: version must be a non-empty string',
    );
  });

  it('delegates detection validation', () => {
    const config = baseConfig();
    delete config.patterns;
    expect(() => validateHookConfig(config)).toThrow(
      'Invalid hook config: patterns must be a non-empty array',
    );
  });

  it('delegates response validation', () => {
    const config = baseConfig();
    delete config.reminder;
    expect(() => validateHookConfig(config)).toThrow(
      'Invalid hook config: reminder must be a non-empty string',
    );
  });
});
