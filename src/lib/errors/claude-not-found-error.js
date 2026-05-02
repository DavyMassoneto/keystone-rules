import { KeystoneError } from './keystone-error.js';

export class ClaudeNotFoundError extends KeystoneError {
  constructor(message) {
    super({ message, code: 'CLAUDE_NOT_FOUND', exitCode: 6 });
  }
}
