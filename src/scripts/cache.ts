const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCached<T>(
  key: string,
  data: T,
  ttlMs: number = TTL_MS,
): void {
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs };
  localStorage.setItem(key, JSON.stringify(entry));
}
