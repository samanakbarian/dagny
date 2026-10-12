/**
 * localStorage wrapper that never throws. If storage is missing or blocked
 * (private mode, disabled cookies, quota) we fall back to an in-memory map so
 * the game keeps working for the current session.
 */
export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): boolean;
  remove(key: string): void;
}

export class MemoryStore implements KeyValueStore {
  private readonly map = new Map<string, string>();
  get(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }
  set(key: string, value: string): boolean {
    this.map.set(key, value);
    return true;
  }
  remove(key: string): void {
    this.map.delete(key);
  }
}

export class SafeLocalStore implements KeyValueStore {
  private readonly fallback = new MemoryStore();
  private readonly ls: Storage | null;

  constructor() {
    let ls: Storage | null = null;
    try {
      ls = typeof localStorage !== 'undefined' ? localStorage : null;
      if (ls) {
        const probe = '__dagny_probe__';
        ls.setItem(probe, '1');
        ls.removeItem(probe);
      }
    } catch {
      ls = null;
    }
    this.ls = ls;
  }

  get available(): boolean {
    return this.ls !== null;
  }

  get(key: string): string | null {
    try {
      if (this.ls) return this.ls.getItem(key);
    } catch {
      /* fall through */
    }
    return this.fallback.get(key);
  }

  set(key: string, value: string): boolean {
    this.fallback.set(key, value);
    try {
      if (this.ls) {
        this.ls.setItem(key, value);
        return true;
      }
    } catch {
      /* quota or blocked – memory copy is kept */
    }
    return false;
  }

  remove(key: string): void {
    this.fallback.remove(key);
    try {
      this.ls?.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}
