import { readFileSync } from 'node:fs';

const packageJsonUrl = new URL('../../../package.json', import.meta.url);

export function getPackageInfo() {
  const pkg = JSON.parse(readFileSync(packageJsonUrl, 'utf8'));
  return {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
  };
}
