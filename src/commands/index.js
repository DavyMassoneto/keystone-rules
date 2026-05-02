export * from './version.js';
export * from './help.js';
export * from './doctor.js';

import { versionCommand } from './version.js';
import { helpCommand } from './help.js';
import { doctorCommand } from './doctor.js';

export const commands = {
  [versionCommand.name]: versionCommand,
  [helpCommand.name]: helpCommand,
  [doctorCommand.name]: doctorCommand,
};
