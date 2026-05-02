import { KeystoneError } from './keystone-error.js';

export class ClaudeTimeoutError extends KeystoneError {
  constructor(message) {
    super({ message, code: 'CLAUDE_TIMEOUT', exitCode: 7 });
  }
}
