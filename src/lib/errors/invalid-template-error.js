import { KeystoneError } from './keystone-error.js';

export class InvalidTemplateError extends KeystoneError {
  constructor(message) {
    super({ message, code: 'INVALID_TEMPLATE', exitCode: 8 });
  }
}
