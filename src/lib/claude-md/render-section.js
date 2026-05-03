import { renderRule } from './render-rule.js';

export function renderSection(section) {
  const ruleLines = section.rules.map((rule) => renderRule(rule));
  return [`## ${section.title}`, '', ...ruleLines].join('\n');
}
