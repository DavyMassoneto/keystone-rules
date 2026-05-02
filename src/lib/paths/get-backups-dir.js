import { join } from 'node:path';
import { getKeystoneDir } from './get-keystone-dir.js';

export function getBackupsDir() {
  return join(getKeystoneDir(), 'backups');
}
