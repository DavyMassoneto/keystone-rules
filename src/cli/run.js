import { parse } from '#lib';
import { commands } from '#commands';
import { route } from './route.js';
import { handleError } from './handle-error.js';

export async function run(argv) {
  try {
    const parsed = parse(argv);
    const command = route(parsed, commands);
    return await command.run(commands, parsed);
  } catch (err) {
    return handleError(err);
  }
}
