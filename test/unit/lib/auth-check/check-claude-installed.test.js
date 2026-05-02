import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkClaudeInstalled } from '#lib/auth-check';
import { runClaude } from '#lib/claude-invoker';
import { ClaudeNotFoundError } from '#lib/errors';

vi.mock('#lib/claude-invoker', async () => {
  const actual = await vi.importActual('#lib/claude-invoker');
  return { ...actual, runClaude: vi.fn() };
});

beforeEach(() => {
  vi.mocked(runClaude).mockReset();
});

describe('checkClaudeInstalled', () => {
  it('returns ok with version when claude --version exits 0', async () => {
    vi.mocked(runClaude).mockResolvedValue({
      stdout: '1.2.3 (Claude Code)\n',
      stderr: '',
      exitCode: 0,
    });
    expect(await checkClaudeInstalled()).toEqual({
      ok: true,
      version: '1.2.3 (Claude Code)',
    });
  });

  it('invokes runClaude with ["--version"] and a 5000ms timeout', async () => {
    vi.mocked(runClaude).mockResolvedValue({
      stdout: 'x',
      stderr: '',
      exitCode: 0,
    });
    await checkClaudeInstalled();
    expect(runClaude).toHaveBeenCalledWith(['--version'], { timeout: 5000 });
  });

  it('returns ok false with stderr when exit code is non-zero', async () => {
    vi.mocked(runClaude).mockResolvedValue({
      stdout: '',
      stderr: "'claude' is not recognized\n",
      exitCode: 1,
    });
    expect(await checkClaudeInstalled()).toEqual({
      ok: false,
      error: "'claude' is not recognized",
    });
  });

  it('falls back to a generic error message when stderr is empty on non-zero exit', async () => {
    vi.mocked(runClaude).mockResolvedValue({
      stdout: '',
      stderr: '',
      exitCode: 9,
    });
    expect(await checkClaudeInstalled()).toEqual({
      ok: false,
      error: 'Claude Code exited with code 9',
    });
  });

  it('returns ok false with the error message when runClaude rejects', async () => {
    vi.mocked(runClaude).mockRejectedValue(
      new ClaudeNotFoundError('Claude Code binary not found in PATH'),
    );
    expect(await checkClaudeInstalled()).toEqual({
      ok: false,
      error: 'Claude Code binary not found in PATH',
    });
  });
});
