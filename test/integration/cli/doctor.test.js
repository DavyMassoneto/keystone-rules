import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runCli } from './_helpers/index.js';

let tempHome;

beforeEach(async () => {
  tempHome = await mkdtemp(join(tmpdir(), 'keystone-doctor-'));
});

afterEach(async () => {
  await rm(tempHome, { recursive: true, force: true });
});

describe('cli doctor', () => {
  it('renders human-readable output and exits 1 when Claude Code is unavailable', async () => {
    const { stdout, exitCode } = await runCli(['doctor'], {
      env: {
        KEYSTONE_CLAUDE_HOME: tempHome,
        PATH: '',
        Path: '',
      },
    });
    expect(stdout).toContain('Node.js version');
    expect(stdout).toContain('Claude Code installed');
    expect(stdout).toContain('Claude Code authenticated');
    expect(stdout).toContain('Claude Code home directory');
    expect(stdout).toContain('keystone-rules manifest');
    expect(stdout).toContain('Manifest JSON validity');
    expect(stdout).toContain('Manifest files on disk');
    expect(stdout).toContain('Claude Code settings.json');
    expect(stdout).toContain('Hook executability');
    expect(exitCode).toBe(1);
  });

  it('produces valid structured JSON when --json flag is set', async () => {
    const { stdout, exitCode } = await runCli(['doctor', '--json'], {
      env: {
        KEYSTONE_CLAUDE_HOME: tempHome,
        PATH: '',
        Path: '',
      },
    });
    const parsed = JSON.parse(stdout);
    expect(Array.isArray(parsed.results)).toBe(true);
    expect(parsed.results).toHaveLength(9);
    const byName = Object.fromEntries(parsed.results.map((r) => [r.name, r]));
    expect(byName['node-version']).toMatchObject({ status: 'ok' });
    expect(byName['claude-installed']).toMatchObject({ status: 'error' });
    expect(byName['claude-authenticated']).toMatchObject({ status: 'skipped' });
    expect(byName['claude-home']).toMatchObject({ status: 'ok' });
    expect(byName['settings-valid']).toMatchObject({ status: 'ok' });
    expect(byName['hooks-executable']).toMatchObject({ status: 'skipped' });
    expect(exitCode).toBe(1);
  });
});
