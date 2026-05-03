import { KeystoneError } from './keystone-error.js';

export class InvalidHookConfigError extends KeystoneError {
  constructor(message) {
    super({ message, code: 'INVALID_HOOK_CONFIG', exitCode: 9 });
  }
}
