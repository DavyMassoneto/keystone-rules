import { describe, it, expect } from 'vitest';
import { formatResult } from '#lib/doctor-output';

describe('formatResult', () => {
  it('returns the unified shape with all four fields', () => {
    expect(
      formatResult({
        name: 'node-version',
        label: 'Node.js version',
        status: 'ok',
        message: 'v24.5.0 satisfies >= 24',
      }),
    ).toEqual({
      name: 'node-version',
      label: 'Node.js version',
      status: 'ok',
      message: 'v24.5.0 satisfies >= 24',
    });
  });

  it('preserves each of the four valid statuses', () => {
    for (const status of ['ok', 'warn', 'error', 'skipped']) {
      expect(
        formatResult({ name: 'x', label: 'X', status, message: 'msg' }).status,
      ).toBe(status);
    }
  });
});
