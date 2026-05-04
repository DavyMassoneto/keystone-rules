import { computeLevenshteinRow } from './compute-levenshtein-row.js';

export function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const initialRow = Array.from({ length: b.length + 1 }, (_, j) => j);
  const finalRow = [...a].reduce(
    (previousRow, sourceChar) => computeLevenshteinRow(previousRow, sourceChar, b),
    initialRow,
  );
  return finalRow[b.length];
}
