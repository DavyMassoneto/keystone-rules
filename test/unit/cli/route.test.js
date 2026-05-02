import { describe, it, expect } from 'vitest';
import { route } from '#cli';
import { UnknownCommandError } from '#lib';

const versionCommand = { name: 'version', description: 'v', run: () => 0 };
const helpCommand = { name: 'help', description: 'h', run: () => 0 };
const commands = { version: versionCommand, help: helpCommand };

describe('route', () => {
  it('returns the version command when --version flag is set', () => {
    expect(
      route({ command: null, flags: { version: true }, positional: [] }, commands),
    ).toBe(versionCommand);
  });

  it('returns the version command when -v flag is set', () => {
    expect(
      route({ command: null, flags: { v: true }, positional: [] }, commands),
    ).toBe(versionCommand);
  });

  it('returns the help command when --help flag is set', () => {
    expect(
      route({ command: null, flags: { help: true }, positional: [] }, commands),
    ).toBe(helpCommand);
  });

  it('returns the help command when -h flag is set', () => {
    expect(
      route({ command: null, flags: { h: true }, positional: [] }, commands),
    ).toBe(helpCommand);
  });

  it('returns the help command when no command and no flags are provided', () => {
    expect(
      route({ command: null, flags: {}, positional: [] }, commands),
    ).toBe(helpCommand);
  });

  it('returns the matching command for a known command name', () => {
    expect(
      route({ command: 'version', flags: {}, positional: [] }, commands),
    ).toBe(versionCommand);
  });

  it('throws UnknownCommandError for an unknown command name', () => {
    expect(() =>
      route({ command: 'install', flags: {}, positional: [] }, commands),
    ).toThrow(UnknownCommandError);
  });

  it('includes the command name and help hint in the unknown command error message', () => {
    expect(() =>
      route({ command: 'install', flags: {}, positional: [] }, commands),
    ).toThrow(
      "Unknown command: 'install'. Run 'ks help' to see available commands.",
    );
  });

  it('prefers --version over --help when both are set', () => {
    expect(
      route(
        { command: null, flags: { version: true, help: true }, positional: [] },
        commands,
      ),
    ).toBe(versionCommand);
  });

  it('prefers --version flag over an unknown command name', () => {
    expect(
      route(
        { command: 'unknown', flags: { version: true }, positional: [] },
        commands,
      ),
    ).toBe(versionCommand);
  });
});
