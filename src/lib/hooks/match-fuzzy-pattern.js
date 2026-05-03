import { normalizedDistance, normalizeText } from '#lib/text-distance';

export function matchFuzzyPattern(normalizedPrompt, pattern, threshold) {
  const normalizedValue = normalizeText(pattern.value);
  const windowSize = normalizedValue.length;
  for (let i = 0; i <= normalizedPrompt.length - windowSize; i++) {
    const window = normalizedPrompt.slice(i, i + windowSize);
    if (normalizedDistance(window, normalizedValue) <= threshold) {
      return true;
    }
  }
  return false;
}
