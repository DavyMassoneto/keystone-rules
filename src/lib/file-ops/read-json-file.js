import { readFile } from 'node:fs/promises';
import { InvalidJsonError } from '../errors/index.js';

export async function readJsonFile(path) {
  const content = await readFile(path, 'utf8');
  try {
    return JSON.parse(content);
  } catch (err) {
    throw new InvalidJsonError(`Invalid JSON at ${path}: ${err.message}`);
  }
}
