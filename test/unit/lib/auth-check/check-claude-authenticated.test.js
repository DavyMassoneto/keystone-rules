import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkClaudeAuthenticated } from '#lib/auth-check';
import { runClaude } from '#lib/claude-invoker';
import { ClaudeTimeoutError } from '#lib/errors';

vi.mock('#lib/claude-invoker', async () => {
  const actual = await vi.importActual('#lib/claude-invoker');
  return { ...actual, runClaude: vi.fn() };
});

beforeEach(() => {
  vi.mocked(runClaude).mockReset();
});

describe('checkClaudeAuthenticated', () => {
  it('returns ok with account when claude auth status exits 0', async () => {
    vi.mocked(runClaude).mockResolvedValue({
      stdout: 'Logged in as user@example.com\n',
      stderr: '',
      exitCode: 0,
    });
    expect(await checkClaudeAuthenticated()).toEqual({
      ok: true,
      account: 'Logged in as user@example.com',
    });
  });

  it('invokes runClaude with ["auth", "status"] and a 5000ms timeout', async () => {
    vi.mocked(runClaude).mockResolvedValue({
      stdout: 'x',
      stderr: '',
      exitCode: 0,
    });
    await checkClaudeAuthenticated();
    expect(runClaude).toHaveBeenCalledWith(['auth', 'status'], {
      timeout: 5000,
    });
  });

  it('returns ok false with stderr when exit code is non-zero', async () => {
    vi.mocked(runClaude).mockResolvedValue({
      stdout: '',
      stderr: 'Not authenticated\n',
      exitCode: 1,
    });
    expect(await checkClaudeAuthenticated()).toEqual({
      ok: false,
      error: 'Not authenticated',
    });
  });

  it('falls back to a generic error message when stderr is empty on non-zero exit', async () => {
    vi.mocked(runClaude).mockResolvedValue({
      stdout: '',
      stderr: '',
      exitCode: 2,
    });
    expect(await checkClaudeAuthenticated()).toEqual({
      ok: false,
      error: 'Claude Code exited with code 2',
    });
  });

  it('returns ok false with the error message when runClaude rejects', async () => {
    vi.mocked(runClaude).mockRejectedValue(
      new ClaudeTimeoutError('Claude Code timed out after 5000ms'),
    );
    expect(await checkClaudeAuthenticated()).toEqual({
      ok: false,
      error: 'Claude Code timed out after 5000ms',
    });
  });
});
