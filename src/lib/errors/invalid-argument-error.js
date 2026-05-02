import { KeystoneError } from './keystone-error.js';

export class InvalidArgumentError extends KeystoneError {
  constructor(message) {
    super({ message, code: 'INVALID_ARGUMENT', exitCode: 2 });
  }
}
