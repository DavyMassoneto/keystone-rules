import { runClaude } from '#lib/claude-invoker';

export async function checkClaudeAuthenticated() {
  try {
    const { stdout, stderr, exitCode } = await runClaude(['auth', 'status'], {
      timeout: 5000,
    });
    if (exitCode === 0) {
      return { ok: true, account: stdout.trim() };
    }
    return {
      ok: false,
      error: stderr.trim() || `Claude Code exited with code ${exitCode}`,
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
