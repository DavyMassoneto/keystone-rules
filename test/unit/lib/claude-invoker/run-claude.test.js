import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { runClaude, ClaudeNotFoundError, ClaudeTimeoutError } from '#lib';

vi.mock('node:child_process', async () => {
  const actual = await vi.importActual('node:child_process');
  return { ...actual, spawn: vi.fn() };
});

function createChildMock() {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  child.kill = vi.fn();
  return child;
}

beforeEach(() => {
  vi.mocked(spawn).mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('runClaude', () => {
  it('resolves with stdout, stderr and exitCode when the child closes', async () => {
    const child = createChildMock();
    vi.mocked(spawn).mockReturnValue(child);
    const promise = runClaude(['--version']);
    child.stdout.emit('data', 'claude 1.0.0\n');
    child.stderr.emit('data', 'a warning');
    child.emit('close', 0);
    expect(await promise).toEqual({
      stdout: 'claude 1.0.0\n',
      stderr: 'a warning',
      exitCode: 0,
    });
  });

  it('rejects with ClaudeNotFoundError when the child emits an ENOENT error', async () => {
    const child = createChildMock();
    vi.mocked(spawn).mockReturnValue(child);
    const promise = runClaude(['--version']);
    const err = new Error('not found');
    err.code = 'ENOENT';
    child.emit('error', err);
    await expect(promise).rejects.toBeInstanceOf(ClaudeNotFoundError);
  });

  it('rejects with the original error for non-ENOENT spawn errors', async () => {
    const child = createChildMock();
    vi.mocked(spawn).mockReturnValue(child);
    const promise = runClaude(['--version']);
    const err = new Error('boom');
    err.code = 'EACCES';
    child.emit('error', err);
    await expect(promise).rejects.toBe(err);
  });

  it('rejects with ClaudeTimeoutError when the timeout expires', async () => {
    vi.useFakeTimers();
    const child = createChildMock();
    vi.mocked(spawn).mockReturnValue(child);
    const promise = runClaude(['--version'], { timeout: 5000 });
    vi.advanceTimersByTime(5000);
    await expect(promise).rejects.toBeInstanceOf(ClaudeTimeoutError);
    expect(child.kill).toHaveBeenCalled();
  });

  it('ignores subsequent close events after the timeout has settled the promise', async () => {
    vi.useFakeTimers();
    const child = createChildMock();
    vi.mocked(spawn).mockReturnValue(child);
    const promise = runClaude(['--version'], { timeout: 5000 });
    vi.advanceTimersByTime(5000);
    child.emit('close', 137);
    await expect(promise).rejects.toBeInstanceOf(ClaudeTimeoutError);
  });

  it('clears the timeout when the child closes before it fires', async () => {
    vi.useFakeTimers();
    const child = createChildMock();
    vi.mocked(spawn).mockReturnValue(child);
    const promise = runClaude(['--version'], { timeout: 5000 });
    child.emit('close', 0);
    expect(await promise).toMatchObject({ exitCode: 0 });
    expect(child.kill).not.toHaveBeenCalled();
  });

  it('does not start a timer when timeout is not provided', async () => {
    const child = createChildMock();
    vi.mocked(spawn).mockReturnValue(child);
    const promise = runClaude(['--version']);
    child.emit('close', 0);
    expect(await promise).toMatchObject({ exitCode: 0 });
  });

  it('passes the merged env to spawn when env is provided', () => {
    const child = createChildMock();
    vi.mocked(spawn).mockReturnValue(child);
    runClaude(['--version'], { env: { CUSTOM: 'value' } });
    expect(spawn).toHaveBeenCalledWith(
      'claude',
      ['--version'],
      expect.objectContaining({
        env: expect.objectContaining({ CUSTOM: 'value' }),
      }),
    );
  });

  it('passes process.env to spawn when env is not provided', () => {
    const child = createChildMock();
    vi.mocked(spawn).mockReturnValue(child);
    runClaude(['--version']);
    expect(spawn).toHaveBeenCalledWith(
      'claude',
      ['--version'],
      expect.objectContaining({ env: process.env }),
    );
  });

  it('passes cwd to spawn when provided', () => {
    const child = createChildMock();
    vi.mocked(spawn).mockReturnValue(child);
    runClaude(['--version'], { cwd: '/some/dir' });
    expect(spawn).toHaveBeenCalledWith(
      'claude',
      ['--version'],
      expect.objectContaining({ cwd: '/some/dir' }),
    );
  });
});
