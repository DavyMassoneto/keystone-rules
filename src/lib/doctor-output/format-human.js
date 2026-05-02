const ICONS = {
  ok: '✓',
  warn: '⚠',
  error: '✗',
  skipped: '–',
};

const ANSI = {
  ok: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  skipped: '\x1b[2m',
};

const RESET = '\x1b[0m';

export function formatHumanOutput(results, { colors = true } = {}) {
  return results
    .map((r) => {
      const line = `${ICONS[r.status]} ${r.label}: ${r.message}`;
      return colors ? `${ANSI[r.status]}${line}${RESET}` : line;
    })
    .join('\n');
}
