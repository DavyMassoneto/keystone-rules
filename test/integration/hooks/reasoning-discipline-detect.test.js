import { describe, it, expect } from 'vitest';
import { runHook } from './_helpers/run-hook.mjs';

const reminderSnippet =
  'RLHF training has made you prone to fabricating fault';

describe('reasoning-discipline detect hook', () => {
  it('exits 0 with empty stdout when the prompt is clean', async () => {
    const { stdout, stderr, exitCode } = await runHook(
      JSON.stringify({
        prompt: 'please review this diff',
        hook_event_name: 'UserPromptSubmit',
      }),
    );
    expect(exitCode).toBe(0);
    expect(stdout).toBe('');
    expect(stderr).toBe('');
  });

  it('emits the reminder JSON to stdout when a fuzzy pattern matches', async () => {
    const { stdout, stderr, exitCode } = await runHook(
      JSON.stringify({
        prompt: 'i think you are wrong about this',
        hook_event_name: 'UserPromptSubmit',
      }),
    );
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    const parsed = JSON.parse(stdout);
    expect(parsed.hookSpecificOutput.hookEventName).toBe('UserPromptSubmit');
    expect(parsed.hookSpecificOutput.additionalContext).toContain(
      reminderSnippet,
    );
  });

  it('emits the reminder JSON to stdout when the capitalization regex matches', async () => {
    const { stdout, stderr, exitCode } = await runHook(
      JSON.stringify({
        prompt: 'isso é PROIBIDO aqui',
        hook_event_name: 'UserPromptSubmit',
      }),
    );
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    const parsed = JSON.parse(stdout);
    expect(parsed.hookSpecificOutput.additionalContext).toContain(
      reminderSnippet,
    );
  });

  it('exits non-zero with stderr message when stdin is malformed JSON', async () => {
    const { stdout, stderr, exitCode } = await runHook('{ not valid json');
    expect(exitCode).not.toBe(0);
    expect(stdout).toBe('');
    expect(stderr).toContain('reasoning-discipline detect hook failed');
  });

  it('exits non-zero with stderr message when the event lacks the prompt field', async () => {
    const { stdout, stderr, exitCode } = await runHook(
      JSON.stringify({ hook_event_name: 'UserPromptSubmit' }),
    );
    expect(exitCode).not.toBe(0);
    expect(stdout).toBe('');
    expect(stderr).toContain(
      'Invalid hook event: prompt must be a non-empty string',
    );
  });
});
