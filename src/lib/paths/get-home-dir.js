import { homedir } from 'node:os';

export function getHomeDir() {
  return homedir();
}
