import { getPackageInfo, print } from '#lib';

export const versionCommand = {
  name: 'version',
  description: 'Print the keystone-rules version',
  run() {
    const { name, version } = getPackageInfo();
    print(`${name} ${version}`);
    return 0;
  },
};
