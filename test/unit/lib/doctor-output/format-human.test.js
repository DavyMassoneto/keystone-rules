import { describe, it, expect } from 'vitest';
import { formatHumanOutput } from '#lib/doctor-output';

const sample = [
  { name: 'a', label: 'A', status: 'ok', message: 'good' },
  { name: 'b', label: 'B', status: 'warn', message: 'careful' },
  { name: 'c', label: 'C', status: 'error', message: 'bad' },
  { name: 'd', label: 'D', status: 'skipped', message: 'later' },
];

describe('formatHumanOutput', () => {
  it('renders one line per result without colors when colors is false', () => {
    expect(formatHumanOutput(sample, { colors: false })).toBe(
      [
        '✓ A: good',
        '⚠ B: careful',
        '✗ C: bad',
        '– D: later',
      ].join('\n'),
    );
  });

  it('wraps each line with ANSI color codes when colors is true', () => {
    const output = formatHumanOutput(sample, { colors: true });
    expect(output).toContain('\x1b[32m✓ A: good\x1b[0m');
    expect(output).toContain('\x1b[33m⚠ B: careful\x1b[0m');
    expect(output).toContain('\x1b[31m✗ C: bad\x1b[0m');
    expect(output).toContain('\x1b[2m– D: later\x1b[0m');
  });

  it('defaults to colors when no option is provided', () => {
    expect(formatHumanOutput([sample[0]])).toContain('\x1b[32m');
  });

  it('returns an empty string when there are no results', () => {
    expect(formatHumanOutput([], { colors: false })).toBe('');
  });
});
