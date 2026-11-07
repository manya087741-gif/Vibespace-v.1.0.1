// Intelligent Cache & Storage Manager
// Automatically clears expired temporary cache while preserving all user posts, messages, media, and account data.

const TEMP_PREFIX = 'nxg_temp_';
const DEFAULT_TTL_MS = 1000 * 60 * 15; // 15 minutes

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const inFlightRequests = new Map<string, Promise<unknown>>();

export const cacheManager = {
  setTemp<T>(key: string, data: T, ttlMs = DEFAULT_TTL_MS): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        expiresAt: Date.now() + ttlMs,
      };
      localStorage.setItem(`${TEMP_PREFIX}${key}`, JSON.stringify(entry));
    } catch {
      // Ignore quota errors
    }
  },

  getTemp<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`${TEMP_PREFIX}${key}`);
      if (!raw) return null;
      const entry = JSON.parse(raw) as CacheEntry<T>;
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(`${TEMP_PREFIX}${key}`);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  },

  clearExpiredTemp(): number {
    let cleared = 0;
    try {
      const now = Date.now();
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(TEMP_PREFIX)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw) as CacheEntry<unknown>;
            if (now > parsed.expiresAt) {
              localStorage.removeItem(key);
              cleared += 1;
            }
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
    return cleared;
  },

  async dedupedFetch<T>(url: string, ttlMs = 30_000): Promise<T> {
    const cached = this.getTemp<T>(url);
    if (cached !== null) return cached;

    const existing = inFlightRequests.get(url);
    if (existing) return existing as Promise<T>;

    const promise = fetch(url)
      .then((res) => res.json() as Promise<T>)
      .then((data) => {
        this.setTemp(url, data, ttlMs);
        inFlightRequests.delete(url);
        return data;
      })
      .catch((err) => {
        inFlightRequests.delete(url);
        throw err;
      });

    inFlightRequests.set(url, promise);
    return promise;
  },
};
