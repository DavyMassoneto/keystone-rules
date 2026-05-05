import { access, mkdir, unlink, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export class PressureFlag {
  constructor(path) {
    this.path = path;
  }

  async write() {
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(this.path, '');
  }

  async has() {
    try {
      await access(this.path);
      return true;
    } catch {
      return false;
    }
  }

  async clear() {
    try {
      await unlink(this.path);
    } catch {
      // idempotent: no-op if file does not exist
    }
  }
}
