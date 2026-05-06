import { normalizeText } from '#lib/text-distance';
import { matchFuzzyPattern } from './match-fuzzy-pattern.js';

export function detectPressure(prompt, hookConfig) {
  const normalizedPrompt = normalizeText(prompt);
  for (const pattern of hookConfig.patterns) {
    if (
      pattern.type === 'fuzzy' &&
      matchFuzzyPattern(normalizedPrompt, pattern, hookConfig.fuzzyThreshold)
    ) {
      return true;
    }
    if (pattern.type === 'regex' && new RegExp(pattern.value).test(prompt)) {
      return true;
    }
  }
  return false;
}
