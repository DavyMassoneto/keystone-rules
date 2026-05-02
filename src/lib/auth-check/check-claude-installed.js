import { runClaude } from '#lib/claude-invoker';

export async function checkClaudeInstalled() {
  try {
    const { stdout, stderr, exitCode } = await runClaude(['--version'], {
      timeout: 5000,
    });
    if (exitCode === 0) {
      return { ok: true, version: stdout.trim() };
    }
    return {
      ok: false,
      error: stderr.trim() || `Claude Code exited with code ${exitCode}`,
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
