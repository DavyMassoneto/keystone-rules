/**
 * @typedef {'ok' | 'warn' | 'error' | 'skipped'} DoctorStatus
 */

/**
 * @typedef {object} DoctorResult
 * @property {string} name   identifier (kebab-case), e.g. 'node-version'
 * @property {string} label  human-readable label, e.g. 'Node.js version'
 * @property {DoctorStatus} status
 * @property {string} message  detail or recommendation
 */

/**
 * Builds the unified result shape consumed by the formatters.
 *
 * @param {DoctorResult} input
 * @returns {DoctorResult}
 */
export function formatResult({ name, label, status, message }) {
  return { name, label, status, message };
}
