import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { doctorCommand } from '#commands';
import {
  runDoctorChecks,
  formatHumanOutput,
  formatJsonOutput,
  print,
} from '#lib';

vi.mock('#lib', async () => {
  const actual = await vi.importActual('#lib');
  return {
    ...actual,
    runDoctorChecks: vi.fn(),
    formatHumanOutput: vi.fn(() => 'human-output'),
    formatJsonOutput: vi.fn(() => 'json-output'),
    print: vi.fn(),
  };
});

const originalIsTTY = process.stdout.isTTY;
const originalNoColor = process.env.NO_COLOR;

function setTTY(value) {
  Object.defineProperty(process.stdout, 'isTTY', {
    value,
    configurable: true,
  });
}

beforeEach(() => {
  vi.mocked(runDoctorChecks).mockReset();
  vi.mocked(formatHumanOutput).mockClear();
  vi.mocked(formatJsonOutput).mockClear();
  vi.mocked(print).mockClear();
  vi.mocked(formatHumanOutput).mockReturnValue('human-output');
  vi.mocked(formatJsonOutput).mockReturnValue('json-output');
});

afterEach(() => {
  Object.defineProperty(process.stdout, 'isTTY', {
    value: originalIsTTY,
    configurable: true,
  });
  if (originalNoColor === undefined) {
    delete process.env.NO_COLOR;
  } else {
    process.env.NO_COLOR = originalNoColor;
  }
});

describe('doctorCommand', () => {
  it('exposes name "doctor"', () => {
    expect(doctorCommand.name).toBe('doctor');
  });

  it('exposes a description', () => {
    expect(doctorCommand.description).toBe(
      'Run diagnostic checks on keystone-rules installation',
    );
  });

  it('renders human output and prints it when --json is not set', async () => {
    setTTY(false);
    vi.mocked(runDoctorChecks).mockResolvedValue([
      { name: 'a', label: 'A', status: 'ok', message: 'good' },
    ]);
    await doctorCommand.run({}, { flags: {} });
    expect(formatHumanOutput).toHaveBeenCalled();
    expect(formatJsonOutput).not.toHaveBeenCalled();
    expect(print).toHaveBeenCalledWith('human-output');
  });

  it('renders JSON output and prints it when --json is set', async () => {
    setTTY(false);
    vi.mocked(runDoctorChecks).mockResolvedValue([
      { name: 'a', label: 'A', status: 'ok', message: 'good' },
    ]);
    await doctorCommand.run({}, { flags: { json: true } });
    expect(formatJsonOutput).toHaveBeenCalled();
    expect(formatHumanOutput).not.toHaveBeenCalled();
    expect(print).toHaveBeenCalledWith('json-output');
  });

  it('passes colors true when stdout is a TTY and NO_COLOR is unset', async () => {
    setTTY(true);
    delete process.env.NO_COLOR;
    vi.mocked(runDoctorChecks).mockResolvedValue([
      { name: 'a', label: 'A', status: 'ok', message: '' },
    ]);
    await doctorCommand.run({}, { flags: {} });
    expect(formatHumanOutput).toHaveBeenCalledWith(expect.any(Array), {
      colors: true,
    });
  });

  it('passes colors false when NO_COLOR is set', async () => {
    setTTY(true);
    process.env.NO_COLOR = '1';
    vi.mocked(runDoctorChecks).mockResolvedValue([
      { name: 'a', label: 'A', status: 'ok', message: '' },
    ]);
    await doctorCommand.run({}, { flags: {} });
    expect(formatHumanOutput).toHaveBeenCalledWith(expect.any(Array), {
      colors: false,
    });
  });

  it('passes colors false when stdout is not a TTY', async () => {
    setTTY(false);
    delete process.env.NO_COLOR;
    vi.mocked(runDoctorChecks).mockResolvedValue([
      { name: 'a', label: 'A', status: 'ok', message: '' },
    ]);
    await doctorCommand.run({}, { flags: {} });
    expect(formatHumanOutput).toHaveBeenCalledWith(expect.any(Array), {
      colors: false,
    });
  });

  it('returns 0 when no result has error status', async () => {
    setTTY(false);
    vi.mocked(runDoctorChecks).mockResolvedValue([
      { name: 'a', label: 'A', status: 'ok', message: '' },
      { name: 'b', label: 'B', status: 'warn', message: '' },
      { name: 'c', label: 'C', status: 'skipped', message: '' },
    ]);
    expect(await doctorCommand.run({}, { flags: {} })).toBe(0);
  });

  it('returns 1 when any result has error status', async () => {
    setTTY(false);
    vi.mocked(runDoctorChecks).mockResolvedValue([
      { name: 'a', label: 'A', status: 'ok', message: '' },
      { name: 'b', label: 'B', status: 'error', message: 'broken' },
    ]);
    expect(await doctorCommand.run({}, { flags: {} })).toBe(1);
  });
});
