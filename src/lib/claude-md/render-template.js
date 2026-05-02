import { renderSection } from './render-section.js';

const HEADER = '# Agent rules';

export function renderTemplate(template) {
  const sectionBlocks = template.sections.map((section) =>
    renderSection(section),
  );
  return [HEADER, '', sectionBlocks.join('\n\n')].join('\n');
}
