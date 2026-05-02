import { describe, it, expect, beforeEach, vi } from 'vitest';
import { versionCommand } from '#commands';
import { getPackageInfo, print } from '#lib';

vi.mock('#lib', async () => {
  const actual = await vi.importActual('#lib');
  return {
    ...actual,
    getPackageInfo: vi.fn(),
    print: vi.fn(),
  };
});

beforeEach(() => {
  vi.mocked(getPackageInfo).mockReturnValue({
    name: 'keystone-rules',
    version: '1.2.3',
    description: 'desc',
  });
  vi.mocked(print).mockClear();
});

describe('versionCommand', () => {
  it('exposes name "version"', () => {
    expect(versionCommand.name).toBe('version');
  });

  it('exposes the description', () => {
    expect(versionCommand.description).toBe(
      'Print the keystone-rules version',
    );
  });

  it('prints the package name and version on run', () => {
    versionCommand.run();
    expect(print).toHaveBeenCalledWith('keystone-rules 1.2.3');
  });

  it('returns exit code 0 from run', () => {
    expect(versionCommand.run()).toBe(0);
  });
});
