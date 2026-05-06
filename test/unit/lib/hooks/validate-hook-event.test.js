import { describe, it, expect } from 'vitest';
import { InvalidHookConfigError } from '#lib';
import { validateHookEvent } from '#lib/hooks';

const baseEvent = () => ({
  prompt: 'please review this diff',
  hook_event_name: 'UserPromptSubmit',
});

describe('validateHookEvent', () => {
  it('returns the event when it is valid', () => {
    const event = baseEvent();
    expect(validateHookEvent(event)).toBe(event);
  });

  it('throws InvalidHookConfigError when event is not an object', () => {
    expect(() => validateHookEvent('nope')).toThrow(InvalidHookConfigError);
    expect(() => validateHookEvent('nope')).toThrow(
      'Invalid hook event: must be a non-null object',
    );
  });

  it('throws when event is null', () => {
    expect(() => validateHookEvent(null)).toThrow(
      'Invalid hook event: must be a non-null object',
    );
  });

  it('throws when prompt is missing', () => {
    const event = baseEvent();
    delete event.prompt;
    expect(() => validateHookEvent(event)).toThrow(
      'Invalid hook event: prompt must be a non-empty string',
    );
  });

  it('throws when prompt is empty', () => {
    expect(() =>
      validateHookEvent({ ...baseEvent(), prompt: '' }),
    ).toThrow('Invalid hook event: prompt must be a non-empty string');
  });

  it('throws when hook_event_name is missing', () => {
    const event = baseEvent();
    delete event.hook_event_name;
    expect(() => validateHookEvent(event)).toThrow(
      'Invalid hook event: hook_event_name must be "UserPromptSubmit"',
    );
  });

  it('throws when hook_event_name has any other value', () => {
    expect(() =>
      validateHookEvent({ ...baseEvent(), hook_event_name: 'PostToolUse' }),
    ).toThrow(
      'Invalid hook event: hook_event_name must be "UserPromptSubmit"',
    );
  });
});
