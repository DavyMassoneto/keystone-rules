import {
  checkClaudeInstalled,
  checkClaudeAuthenticated,
} from '#lib/auth-check';
import { pathExists, readJsonFile } from '#lib/file-ops';
import { getClaudeHome, getSettingsPath } from '#lib/paths';
import { formatResult } from './format-result.js';

const MIN_NODE_MAJOR = 24;

export async function runDoctorChecks() {
  const results = [];

  const nodeMajor = parseInt(process.version.slice(1).split('.')[0], 10);
  results.push(
    formatResult({
      name: 'node-version',
      label: 'Node.js version',
      status: nodeMajor >= MIN_NODE_MAJOR ? 'ok' : 'error',
      message:
        nodeMajor >= MIN_NODE_MAJOR
          ? `${process.version} satisfies >= ${MIN_NODE_MAJOR}`
          : `${process.version} does not satisfy minimum >= ${MIN_NODE_MAJOR}`,
    }),
  );

  const installed = await checkClaudeInstalled();
  results.push(
    formatResult({
      name: 'claude-installed',
      label: 'Claude Code installed',
      status: installed.ok ? 'ok' : 'error',
      message: installed.ok ? installed.version : installed.error,
    }),
  );

  if (installed.ok) {
    const auth = await checkClaudeAuthenticated();
    results.push(
      formatResult({
        name: 'claude-authenticated',
        label: 'Claude Code authenticated',
        status: auth.ok ? 'ok' : 'error',
        message: auth.ok ? auth.account : auth.error,
      }),
    );
  } else {
    results.push(
      formatResult({
        name: 'claude-authenticated',
        label: 'Claude Code authenticated',
        status: 'skipped',
        message: 'Claude Code is not installed',
      }),
    );
  }

  const claudeHome = getClaudeHome();
  const claudeHomeExists = await pathExists(claudeHome);
  results.push(
    formatResult({
      name: 'claude-home',
      label: 'Claude Code home directory',
      status: claudeHomeExists ? 'ok' : 'warn',
      message: claudeHomeExists
        ? claudeHome
        : `${claudeHome} does not exist (run 'claude' once to create it)`,
    }),
  );

  results.push(
    formatResult({
      name: 'manifest-exists',
      label: 'keystone-rules manifest',
      status: 'skipped',
      message: 'install command is not implemented yet',
    }),
  );
  results.push(
    formatResult({
      name: 'manifest-valid',
      label: 'Manifest JSON validity',
      status: 'skipped',
      message: 'no manifest to validate',
    }),
  );
  results.push(
    formatResult({
      name: 'manifest-files',
      label: 'Manifest files on disk',
      status: 'skipped',
      message: 'no manifest to enumerate',
    }),
  );

  if (!claudeHomeExists) {
    results.push(
      formatResult({
        name: 'settings-valid',
        label: 'Claude Code settings.json',
        status: 'skipped',
        message: 'Claude Code home directory does not exist',
      }),
    );
  } else {
    const settingsPath = getSettingsPath();
    if (!(await pathExists(settingsPath))) {
      results.push(
        formatResult({
          name: 'settings-valid',
          label: 'Claude Code settings.json',
          status: 'ok',
          message: 'no settings file (using Claude Code defaults)',
        }),
      );
    } else {
      try {
        await readJsonFile(settingsPath);
        results.push(
          formatResult({
            name: 'settings-valid',
            label: 'Claude Code settings.json',
            status: 'ok',
            message: `${settingsPath} is valid JSON`,
          }),
        );
      } catch (err) {
        results.push(
          formatResult({
            name: 'settings-valid',
            label: 'Claude Code settings.json',
            status: 'error',
            message: err.message,
          }),
        );
      }
    }
  }

  results.push(
    formatResult({
      name: 'hooks-executable',
      label: 'Hook executability',
      status: 'skipped',
      message: 'install command is not implemented yet',
    }),
  );

  return results;
}
