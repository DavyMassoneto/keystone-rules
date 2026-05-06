import { describe, it, expect } from 'vitest';
import { InvalidHookConfigError } from '#lib';
import { validateDetectionConfig } from '#lib/hooks';

const baseConfig = () => ({
  patterns: [{ type: 'fuzzy', value: 'you are wrong' }],
  fuzzyThreshold: 0.25,
});

describe('validateDetectionConfig', () => {
  it('does not throw for a valid detection block', () => {
    expect(() => validateDetectionConfig(baseConfig())).not.toThrow();
  });

  it('throws InvalidHookConfigError when patterns is missing', () => {
    const config = baseConfig();
    delete config.patterns;
    expect(() => validateDetectionConfig(config)).toThrow(
      InvalidHookConfigError,
    );
    expect(() => validateDetectionConfig(config)).toThrow(
      'Invalid hook config: patterns must be a non-empty array',
    );
  });

  it('throws when patterns is empty', () => {
    expect(() =>
      validateDetectionConfig({ ...baseConfig(), patterns: [] }),
    ).toThrow('Invalid hook config: patterns must be a non-empty array');
  });

  it('delegates each pattern entry to validatePattern with an indexed path', () => {
    expect(() =>
      validateDetectionConfig({
        ...baseConfig(),
        patterns: [
          { type: 'fuzzy', value: 'ok' },
          { type: 'glob', value: 'x' },
        ],
      }),
    ).toThrow(
      'Invalid hook config: patterns[1].type must be "fuzzy" or "regex"',
    );
  });

  it('throws when fuzzyThreshold is missing', () => {
    const config = baseConfig();
    delete config.fuzzyThreshold;
    expect(() => validateDetectionConfig(config)).toThrow(
      'Invalid hook config: fuzzyThreshold must be a number between 0 and 1',
    );
  });

  it('throws when fuzzyThreshold is below 0', () => {
    expect(() =>
      validateDetectionConfig({ ...baseConfig(), fuzzyThreshold: -0.1 }),
    ).toThrow(
      'Invalid hook config: fuzzyThreshold must be a number between 0 and 1',
    );
  });

  it('throws when fuzzyThreshold is above 1', () => {
    expect(() =>
      validateDetectionConfig({ ...baseConfig(), fuzzyThreshold: 1.5 }),
    ).toThrow(
      'Invalid hook config: fuzzyThreshold must be a number between 0 and 1',
    );
  });

  it('throws when fuzzyThreshold is not a number', () => {
    expect(() =>
      validateDetectionConfig({ ...baseConfig(), fuzzyThreshold: '0.25' }),
    ).toThrow(
      'Invalid hook config: fuzzyThreshold must be a number between 0 and 1',
    );
  });
});
