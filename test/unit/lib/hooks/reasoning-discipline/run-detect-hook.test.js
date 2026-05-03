import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runReasoningDisciplineDetect } from '#lib/hooks/reasoning-discipline';
import { readStdin } from '#lib/hooks';
import { readFile } from 'node:fs/promises';

vi.mock('#lib/hooks', async () => {
  const actual = await vi.importActual('#lib/hooks');
  return { ...actual, readStdin: vi.fn() };
});

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual('node:fs/promises');
  return { ...actual, readFile: vi.fn() };
});

const validConfig = {
  version: '1.0.0',
  name: 'reasoning-discipline',
  description: 'detects social pressure',
  patterns: [
    { type: 'fuzzy', value: 'you are wrong' },
    { type: 'regex', value: '!{3,}' },
  ],
  fuzzyThreshold: 0.25,
  reminder: 'STOP. Do not capitulate.',
};

let stdoutSpy;
let stderrSpy;

beforeEach(() => {
  readFile.mockResolvedValue(JSON.stringify(validConfig));
  stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('runReasoningDisciplineDetect', () => {
  it('writes the formatted hook context to stdout when a fuzzy pattern matches', async () => {
    readStdin.mockResolvedValue(
      JSON.stringify({
        prompt: 'you are wrong about this',
        hook_event_name: 'UserPromptSubmit',
      }),
    );
    await runReasoningDisciplineDetect();
    expect(stdoutSpy).toHaveBeenCalledTimes(1);
    const written = JSON.parse(stdoutSpy.mock.calls[0][0]);
    expect(written).toEqual({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: validConfig.reminder,
      },
    });
  });

  it('writes nothing to stdout when no pattern matches', async () => {
    readStdin.mockResolvedValue(
      JSON.stringify({
        prompt: 'please review this diff',
        hook_event_name: 'UserPromptSubmit',
      }),
    );
    await runReasoningDisciplineDetect();
    expect(stdoutSpy).not.toHaveBeenCalled();
  });

  it('writes nothing to stdout when only a regex pattern matches', async () => {
    readStdin.mockResolvedValue(
      JSON.stringify({
        prompt: 'this is broken!!!',
        hook_event_name: 'UserPromptSubmit',
      }),
    );
    await runReasoningDisciplineDetect();
    expect(stdoutSpy).toHaveBeenCalledTimes(1);
  });

  it('throws when stdin is malformed JSON', async () => {
    readStdin.mockResolvedValue('{not valid json');
    await expect(runReasoningDisciplineDetect()).rejects.toThrow(SyntaxError);
  });

  it('throws when the parsed event lacks the prompt field', async () => {
    readStdin.mockResolvedValue(
      JSON.stringify({ hook_event_name: 'UserPromptSubmit' }),
    );
    await expect(runReasoningDisciplineDetect()).rejects.toThrow(
      'Invalid hook event: prompt must be a non-empty string',
    );
  });

  it('throws when the parsed event hook_event_name is wrong', async () => {
    readStdin.mockResolvedValue(
      JSON.stringify({
        prompt: 'hi',
        hook_event_name: 'PostToolUse',
      }),
    );
    await expect(runReasoningDisciplineDetect()).rejects.toThrow(
      'Invalid hook event: hook_event_name must be "UserPromptSubmit"',
    );
  });

  it('throws when the loaded config is malformed', async () => {
    readStdin.mockResolvedValue(
      JSON.stringify({
        prompt: 'hi',
        hook_event_name: 'UserPromptSubmit',
      }),
    );
    readFile.mockResolvedValue('{ broken json');
    await expect(runReasoningDisciplineDetect()).rejects.toThrow(SyntaxError);
  });

  it('throws when the loaded config fails schema validation', async () => {
    readStdin.mockResolvedValue(
      JSON.stringify({
        prompt: 'hi',
        hook_event_name: 'UserPromptSubmit',
      }),
    );
    readFile.mockResolvedValue(JSON.stringify({ ...validConfig, version: '' }));
    await expect(runReasoningDisciplineDetect()).rejects.toThrow(
      'Invalid hook config: version must be a non-empty string',
    );
  });
});
