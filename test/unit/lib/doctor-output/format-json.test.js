import { describe, it, expect } from 'vitest';
import { formatJsonOutput } from '#lib/doctor-output';

const sample = [
  { name: 'a', label: 'A', status: 'ok', message: 'good' },
  { name: 'b', label: 'B', status: 'error', message: 'bad' },
];

describe('formatJsonOutput', () => {
  it('produces valid JSON wrapping the results array under a "results" key', () => {
    const parsed = JSON.parse(formatJsonOutput(sample));
    expect(parsed).toEqual({ results: sample });
  });

  it('indents with 2 spaces', () => {
    const output = formatJsonOutput(sample);
    expect(output).toContain('\n  "results"');
  });

  it('returns a JSON document for an empty array', () => {
    expect(JSON.parse(formatJsonOutput([]))).toEqual({ results: [] });
  });
});
