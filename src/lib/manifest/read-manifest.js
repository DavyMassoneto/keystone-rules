import { pathExists, readJsonFile } from '#lib/file-ops';
import { getManifestPath } from '#lib/paths';

/**
 * @typedef {object} Manifest
 * @property {string} version
 * @property {string} installedAt
 * @property {string} updatedAt
 * @property {Array<{ path: string, hash: string }>} files
 * @property {string[]} mergedFiles
 */

/**
 * Reads the keystone-rules installation manifest from disk.
 *
 * @returns {Promise<Manifest | null>} parsed manifest, or null when the file does not exist
 */
export async function readManifest() {
  const path = getManifestPath();
  if (!(await pathExists(path))) {
    return null;
  }
  return readJsonFile(path);
}
