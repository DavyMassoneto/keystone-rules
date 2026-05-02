import { UnsupportedPlatformError } from '#lib/errors';

export function getPlatform() {
  const { platform } = process;
  if (platform === 'linux' || platform === 'darwin' || platform === 'win32') {
    return platform;
  }
  throw new UnsupportedPlatformError(platform);
}
