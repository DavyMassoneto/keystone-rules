import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runDoctorChecks } from '#lib/doctor-output';
import {
  checkClaudeInstalled,
  checkClaudeAuthenticated,
} from '#lib/auth-check';
import { pathExists, readJsonFile } from '#lib/file-ops';
import { getClaudeHome, getSettingsPath } from '#lib/paths';

vi.mock('#lib/auth-check', async () => {
  const actual = await vi.importActual('#lib/auth-check');
  return {
    ...actual,
    checkClaudeInstalled: vi.fn(),
    checkClaudeAuthenticated: vi.fn(),
  };
});

vi.mock('#lib/file-ops', async () => {
  const actual = await vi.importActual('#lib/file-ops');
  return { ...actual, pathExists: vi.fn(), readJsonFile: vi.fn() };
});

vi.mock('#lib/paths', async () => {
  const actual = await vi.importActual('#lib/paths');
  return { ...actual, getClaudeHome: vi.fn(), getSettingsPath: vi.fn() };
});

const originalVersion = process.version;

function setVersion(v) {
  Object.defineProperty(process, 'version', { value: v, configurable: true });
}

beforeEach(() => {
  vi.mocked(checkClaudeInstalled).mockReset();
  vi.mocked(checkClaudeAuthenticated).mockReset();
  vi.mocked(pathExists).mockReset();
  vi.mocked(readJsonFile).mockReset();
  vi.mocked(getClaudeHome).mockReset();
  vi.mocked(getSettingsPath).mockReset();
  vi.mocked(getClaudeHome).mockReturnValue('/mock/home/.claude');
  vi.mocked(getSettingsPath).mockReturnValue('/mock/home/.claude/settings.json');
  setVersion('v24.5.0');
});

afterEach(() => {
  Object.defineProperty(process, 'version', {
    value: originalVersion,
    configurable: true,
  });
});

describe('runDoctorChecks', () => {
  it('returns nine results in a stable order with the expected names', async () => {
    vi.mocked(checkClaudeInstalled).mockResolvedValue({
      ok: true,
      version: '1',
    });
    vi.mocked(checkClaudeAuthenticated).mockResolvedValue({
      ok: true,
      account: 'u',
    });
    vi.mocked(pathExists).mockResolvedValue(true);
    vi.mocked(readJsonFile).mockResolvedValue({});
    const results = await runDoctorChecks();
    expect(results.map((r) => r.name)).toEqual([
      'node-version',
      'claude-installed',
      'claude-authenticated',
      'claude-home',
      'manifest-exists',
      'manifest-valid',
      'manifest-files',
      'settings-valid',
      'hooks-executable',
    ]);
  });

  it('marks node-version as ok when the major version meets the minimum', async () => {
    vi.mocked(checkClaudeInstalled).mockResolvedValue({
      ok: true,
      version: '1',
    });
    vi.mocked(checkClaudeAuthenticated).mockResolvedValue({
      ok: true,
      account: 'u',
    });
    vi.mocked(pathExists).mockResolvedValue(true);
    vi.mocked(readJsonFile).mockResolvedValue({});
    const node = (await runDoctorChecks()).find(
      (r) => r.name === 'node-version',
    );
    expect(node.status).toBe('ok');
    expect(node.message).toBe('v24.5.0 satisfies >= 24');
  });

  it('marks node-version as error when the major version is below the minimum', async () => {
    setVersion('v20.10.0');
    vi.mocked(checkClaudeInstalled).mockResolvedValue({
      ok: true,
      version: '1',
    });
    vi.mocked(checkClaudeAuthenticated).mockResolvedValue({
      ok: true,
      account: 'u',
    });
    vi.mocked(pathExists).mockResolvedValue(true);
    vi.mocked(readJsonFile).mockResolvedValue({});
    const node = (await runDoctorChecks()).find(
      (r) => r.name === 'node-version',
    );
    expect(node.status).toBe('error');
    expect(node.message).toBe('v20.10.0 does not satisfy minimum >= 24');
  });

  it('marks claude-installed as error and skips claude-authenticated when Claude is missing', async () => {
    vi.mocked(checkClaudeInstalled).mockResolvedValue({
      ok: false,
      error: 'not found',
    });
    vi.mocked(pathExists).mockResolvedValue(true);
    vi.mocked(readJsonFile).mockResolvedValue({});
    const results = await runDoctorChecks();
    expect(results.find((r) => r.name === 'claude-installed')).toMatchObject({
      status: 'error',
      message: 'not found',
    });
    expect(
      results.find((r) => r.name === 'claude-authenticated'),
    ).toMatchObject({
      status: 'skipped',
      message: 'Claude Code is not installed',
    });
    expect(checkClaudeAuthenticated).not.toHaveBeenCalled();
  });

  it('marks claude-authenticated as error when authentication fails', async () => {
    vi.mocked(checkClaudeInstalled).mockResolvedValue({
      ok: true,
      version: '1',
    });
    vi.mocked(checkClaudeAuthenticated).mockResolvedValue({
      ok: false,
      error: 'not authed',
    });
    vi.mocked(pathExists).mockResolvedValue(true);
    vi.mocked(readJsonFile).mockResolvedValue({});
    expect(
      (await runDoctorChecks()).find((r) => r.name === 'claude-authenticated'),
    ).toMatchObject({ status: 'error', message: 'not authed' });
  });

  it('marks claude-home as warn and skips settings-valid when the home dir is missing', async () => {
    vi.mocked(checkClaudeInstalled).mockResolvedValue({
      ok: true,
      version: '1',
    });
    vi.mocked(checkClaudeAuthenticated).mockResolvedValue({
      ok: true,
      account: 'u',
    });
    vi.mocked(pathExists).mockResolvedValue(false);
    const results = await runDoctorChecks();
    expect(results.find((r) => r.name === 'claude-home')).toMatchObject({
      status: 'warn',
      message: expect.stringContaining('does not exist'),
    });
    expect(results.find((r) => r.name === 'settings-valid')).toMatchObject({
      status: 'skipped',
      message: 'Claude Code home directory does not exist',
    });
  });

  it('marks settings-valid as ok with a default message when settings.json is absent', async () => {
    vi.mocked(checkClaudeInstalled).mockResolvedValue({
      ok: true,
      version: '1',
    });
    vi.mocked(checkClaudeAuthenticated).mockResolvedValue({
      ok: true,
      account: 'u',
    });
    vi.mocked(pathExists).mockImplementation((p) =>
      Promise.resolve(p === '/mock/home/.claude'),
    );
    const settings = (await runDoctorChecks()).find(
      (r) => r.name === 'settings-valid',
    );
    expect(settings.status).toBe('ok');
    expect(settings.message).toBe(
      'no settings file (using Claude Code defaults)',
    );
  });

  it('marks settings-valid as ok when settings.json parses successfully', async () => {
    vi.mocked(checkClaudeInstalled).mockResolvedValue({
      ok: true,
      version: '1',
    });
    vi.mocked(checkClaudeAuthenticated).mockResolvedValue({
      ok: true,
      account: 'u',
    });
    vi.mocked(pathExists).mockResolvedValue(true);
    vi.mocked(readJsonFile).mockResolvedValue({ ok: true });
    const settings = (await runDoctorChecks()).find(
      (r) => r.name === 'settings-valid',
    );
    expect(settings.status).toBe('ok');
    expect(settings.message).toBe(
      '/mock/home/.claude/settings.json is valid JSON',
    );
  });

  it('marks settings-valid as error when settings.json fails to parse', async () => {
    vi.mocked(checkClaudeInstalled).mockResolvedValue({
      ok: true,
      version: '1',
    });
    vi.mocked(checkClaudeAuthenticated).mockResolvedValue({
      ok: true,
      account: 'u',
    });
    vi.mocked(pathExists).mockResolvedValue(true);
    vi.mocked(readJsonFile).mockRejectedValue(
      new Error('Invalid JSON at /mock/home/.claude/settings.json: oops'),
    );
    const settings = (await runDoctorChecks()).find(
      (r) => r.name === 'settings-valid',
    );
    expect(settings.status).toBe('error');
    expect(settings.message).toContain('oops');
  });

  it('marks the install-dependent checks as skipped in this phase', async () => {
    vi.mocked(checkClaudeInstalled).mockResolvedValue({
      ok: true,
      version: '1',
    });
    vi.mocked(checkClaudeAuthenticated).mockResolvedValue({
      ok: true,
      account: 'u',
    });
    vi.mocked(pathExists).mockResolvedValue(true);
    vi.mocked(readJsonFile).mockResolvedValue({});
    const results = await runDoctorChecks();
    for (const name of [
      'manifest-exists',
      'manifest-valid',
      'manifest-files',
      'hooks-executable',
    ]) {
      expect(results.find((r) => r.name === name)).toMatchObject({
        status: 'skipped',
      });
    }
  });

  it.todo(
    'marks manifest-exists as ok when the manifest file exists (requires install command)',
  );
  it.todo(
    'marks manifest-valid as ok when the manifest is valid JSON (requires install command)',
  );
  it.todo(
    'marks manifest-valid as error when the manifest is invalid JSON (requires install command)',
  );
  it.todo(
    'marks manifest-files as ok when all files in the manifest exist on disk (requires install command)',
  );
  it.todo(
    'marks manifest-files as error when a file in the manifest is missing on disk (requires install command)',
  );
  it.todo(
    'marks manifest-files as error when a file in the manifest has the wrong hash (requires install command)',
  );
  it.todo(
    'marks hooks-executable as ok when all hooks are executable on Unix (requires install command)',
  );
  it.todo(
    'marks hooks-executable as error when a hook is not executable on Unix (requires install command)',
  );
  it.todo(
    'marks hooks-executable as ok on Windows regardless of permission bits (requires install command)',
  );
});
