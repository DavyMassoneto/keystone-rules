export * from './version.js';
export * from './help.js';

import { versionCommand } from './version.js';
import { helpCommand } from './help.js';

export const commands = {
  [versionCommand.name]: versionCommand,
  [helpCommand.name]: helpCommand,
};
