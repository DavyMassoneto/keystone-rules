import { readFile } from 'node:fs/promises';
import { InvalidJsonError } from '#lib/errors';

export async function readTranscript(transcriptPath) {
  const content = await readFile(transcriptPath, 'utf8');
  const events = [];
  for (const [index, line] of content.split('\n').entries()) {
    if (line.length === 0) continue;
    try {
      events.push(JSON.parse(line));
    } catch {
      throw new InvalidJsonError(
        `Invalid JSON in transcript at line ${index + 1}`,
      );
    }
  }
  return events;
}
