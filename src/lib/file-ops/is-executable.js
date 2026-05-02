import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { isWindows } from '#lib/platform';

export async function isExecutable(path) {
  if (isWindows()) {
    return true;
  }
  try {
    await access(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
