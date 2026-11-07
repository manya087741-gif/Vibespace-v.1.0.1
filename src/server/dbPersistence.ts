import fs from 'fs';
import path from 'path';

export interface StorageContainer {
  backendState: any;
  securityState: any;
}

export class DiskPersistence {
  private dbDir: string;
  private dbFile: string;

  constructor(customDir?: string) {
    this.dbDir = customDir || path.join(process.cwd(), 'data');
    this.dbFile = path.join(this.dbDir, 'db.json');
  }

  getDbFilePath(): string {
    return this.dbFile;
  }

  load(target: StorageContainer): boolean {
    try {
      if (fs.existsSync(this.dbFile)) {
        const raw = fs.readFileSync(this.dbFile, 'utf8');
        if (!raw.trim()) return false;
        const parsed = JSON.parse(raw);
        if (parsed.backendState && typeof parsed.backendState === 'object') {
          Object.assign(target.backendState, parsed.backendState);
        }
        if (parsed.securityState && typeof parsed.securityState === 'object') {
          Object.assign(target.securityState, parsed.securityState);
        }
        return true;
      }
    } catch (err) {
      console.warn('[Persistence] Warning: Could not parse db.json, falling back to defaults:', err);
    }
    return false;
  }

  save(data: StorageContainer): boolean {
    try {
      if (!fs.existsSync(this.dbDir)) {
        fs.mkdirSync(this.dbDir, { recursive: true });
      }
      const tmpFile = `${this.dbFile}.tmp.${Date.now()}_${Math.random().toString(36).substring(7)}`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
      fs.renameSync(tmpFile, this.dbFile);
      return true;
    } catch (err) {
      console.error('[Persistence] Error writing db.json:', err);
      return false;
    }
  }
}
