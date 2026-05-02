import { join } from 'node:path';
import { getKeystoneDir } from './get-keystone-dir.js';

export function getManifestPath() {
  return join(getKeystoneDir(), 'manifest.json');
}
