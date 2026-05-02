import { KeystoneError } from './keystone-error.js';

export class UnsupportedPlatformError extends KeystoneError {
  constructor(platform) {
    super({
      message: `Platform "${platform}" is not supported. Supported: linux, darwin, win32.`,
      code: 'UNSUPPORTED_PLATFORM',
      exitCode: 4,
    });
  }
}
