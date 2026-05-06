import { computeLevenshteinRow } from './compute-levenshtein-row.js';

export function levenshteinDistance(source, target) {
  if (source.length === 0) return target.length;
  if (target.length === 0) return source.length;
  let previousRow = Array.from({ length: target.length + 1 }, (_, j) => j);
  for (const sourceChar of source) {
    previousRow = computeLevenshteinRow(previousRow, sourceChar, target);
  }
  return previousRow[target.length];
}
