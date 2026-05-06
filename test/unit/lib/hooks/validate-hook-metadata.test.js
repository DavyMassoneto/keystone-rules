import { describe, it, expect } from 'vitest';
import { InvalidHookConfigError } from '#lib';
import { validateHookMetadata } from '#lib/hooks';

const baseConfig = () => ({
  version: '1.0.0',
  name: 'reasoning-discipline',
  description: 'detects social pressure',
});

describe('validateHookMetadata', () => {
  it('does not throw for a config with all metadata fields', () => {
    expect(() => validateHookMetadata(baseConfig())).not.toThrow();
  });

  it('throws InvalidHookConfigError when version is missing', () => {
    const config = baseConfig();
    delete config.version;
    expect(() => validateHookMetadata(config)).toThrow(InvalidHookConfigError);
    expect(() => validateHookMetadata(config)).toThrow(
      'Invalid hook config: version must be a non-empty string',
    );
  });

  it('throws when version is empty', () => {
    expect(() => validateHookMetadata({ ...baseConfig(), version: '' })).toThrow(
      'Invalid hook config: version must be a non-empty string',
    );
  });

  it('throws when name is missing', () => {
    const config = baseConfig();
    delete config.name;
    expect(() => validateHookMetadata(config)).toThrow(
      'Invalid hook config: name must be a non-empty string',
    );
  });

  it('throws when description is missing', () => {
    const config = baseConfig();
    delete config.description;
    expect(() => validateHookMetadata(config)).toThrow(
      'Invalid hook config: description must be a non-empty string',
    );
  });
});
