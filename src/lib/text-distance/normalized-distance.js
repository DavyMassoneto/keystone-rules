import { levenshteinDistance } from './levenshtein-distance.js';

export function normalizedDistance(a, b) {
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 0;
  return levenshteinDistance(a, b) / maxLength;
}
