const STORAGE_PREFIX = 'ideazone_';

export function getStorageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const item = localStorage.getItem(getStorageKey(key));
    return item ? (JSON.parse(item) as T) : null;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(getStorageKey(key), JSON.stringify(value));
  } catch {
    // Storage might be full or unavailable
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(getStorageKey(key));
  } catch {
    // Ignore errors
  }
}

export function clear(): void {
  if (typeof window === 'undefined') return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore errors
  }
}
