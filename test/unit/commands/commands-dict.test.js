import { describe, it, expect } from 'vitest';
import {
  commands,
  versionCommand,
  helpCommand,
  doctorCommand,
} from '#commands';

describe('commands', () => {
  it('maps each command name to its descriptor', () => {
    expect(commands.version).toBe(versionCommand);
    expect(commands.help).toBe(helpCommand);
    expect(commands.doctor).toBe(doctorCommand);
  });
});
