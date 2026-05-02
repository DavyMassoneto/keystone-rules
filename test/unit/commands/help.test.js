import { describe, it, expect, beforeEach, vi } from 'vitest';
import { helpCommand } from '#commands';
import { print } from '#lib';

vi.mock('#lib', async () => {
  const actual = await vi.importActual('#lib');
  return { ...actual, print: vi.fn() };
});

beforeEach(() => {
  vi.mocked(print).mockClear();
});

describe('helpCommand', () => {
  it('exposes name "help"', () => {
    expect(helpCommand.name).toBe('help');
  });

  it('exposes the description', () => {
    expect(helpCommand.description).toBe(
      'Show available commands and usage information',
    );
  });

  it('prints usage header, command list, and footer when commands are provided', () => {
    const commands = {
      version: {
        name: 'version',
        description: 'Print the keystone-rules version',
      },
      help: {
        name: 'help',
        description: 'Show available commands and usage information',
      },
    };
    helpCommand.run(commands);
    expect(print).toHaveBeenCalledWith(
      [
        'Usage: ks <command> [options]',
        '',
        'Available commands:',
        '  version    Print the keystone-rules version',
        '  help       Show available commands and usage information',
        '',
        "Run 'ks help <command>' for detailed information on a command.",
      ].join('\n'),
    );
  });

  it('returns exit code 0 from run', () => {
    expect(helpCommand.run({})).toBe(0);
  });
});
