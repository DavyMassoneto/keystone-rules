import { print } from '#lib';

export const helpCommand = {
  name: 'help',
  description: 'Show available commands and usage information',
  run(commands) {
    const names = Object.keys(commands);
    const maxNameLen = Math.max(...names.map((n) => n.length));
    const lines = names.map(
      (name) =>
        `  ${name.padEnd(maxNameLen)}    ${commands[name].description}`,
    );
    const output = [
      'Usage: ks <command> [options]',
      '',
      'Available commands:',
      ...lines,
      '',
      "Run 'ks help <command>' for detailed information on a command.",
    ].join('\n');
    print(output);
    return 0;
  },
};
