import { InvalidHookConfigError } from '#lib/errors';
import { isObject } from '#lib/shared';
import { validateDetectionConfig } from './validate-detection-config.js';
import { validateHookMetadata } from './validate-hook-metadata.js';
import { validateHookResponse } from './validate-hook-response.js';

export function validateHookConfig(config) {
  if (!isObject(config)) {
    throw new InvalidHookConfigError(
      'Invalid hook config: must be a non-null object',
    );
  }
  validateHookMetadata(config);
  validateDetectionConfig(config);
  validateHookResponse(config);
  return config;
}
