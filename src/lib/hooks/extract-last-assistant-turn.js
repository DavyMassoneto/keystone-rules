export function extractLastAssistantTurn(events) {
  return events.findLast((event) => event.type === 'assistant');
}
