import { renderRuleExample } from './render-rule-example.js';

export function renderRule(rule) {
  const lines = [`- ${rule.directive}`];
  if (rule.rationale !== undefined) {
    lines.push(`  > ${rule.rationale}`);
  }
  if (rule.example !== undefined) {
    lines.push(renderRuleExample(rule.example));
  }
  return lines.join('\n');
}
