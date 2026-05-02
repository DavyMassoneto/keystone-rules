import { KeystoneError } from './keystone-error.js';

export class InvalidJsonError extends KeystoneError {
  constructor(message) {
    super({ message, code: 'INVALID_JSON', exitCode: 5 });
  }
}
