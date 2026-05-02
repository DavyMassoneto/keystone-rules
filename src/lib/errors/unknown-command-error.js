import { KeystoneError } from './keystone-error.js';

export class UnknownCommandError extends KeystoneError {
  constructor(message) {
    super({ message, code: 'UNKNOWN_COMMAND', exitCode: 3 });
  }
}
