import { UnknownCommandError } from '#lib';

export function route(parsed, commands) {
  if (parsed.flags.version || parsed.flags.v) {
    return commands.version;
  }
  if (parsed.flags.help || parsed.flags.h) {
    return commands.help;
  }
  if (parsed.command === null) {
    return commands.help;
  }
  const command = commands[parsed.command];
  if (command) {
    return command;
  }
  throw new UnknownCommandError(
    `Unknown command: '${parsed.command}'. Run 'ks help' to see available commands.`,
  );
}
