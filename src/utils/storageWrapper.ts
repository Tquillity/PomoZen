let quotaErrorHandler: (() => void) | null = null;

export const setStorageQuotaErrorHandler = (handler: () => void) => {
  quotaErrorHandler = handler;
};

class MemoryStorage implements Storage {
  private map = new Map<string, string>();

  get length(): number {
    return this.map.size;
  }

  clear(): void {
    this.map.clear();
  }

  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.map.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

let storageFallbackWarningShown = false;

class SafeStorage implements Storage {
  private storage: Storage;

  constructor() {
    try {
      this.storage = localStorage;
      // Probe write to detect restricted environments early.
      const probeKey = '__pomozen_storage_probe__';
      this.storage.setItem(probeKey, '1');
      this.storage.removeItem(probeKey);
    } catch {
      this.storage = new MemoryStorage();
      // Show warning once per session
      if (!storageFallbackWarningShown && typeof window !== 'undefined') {
        storageFallbackWarningShown = true;
        // Dispatch custom event that App.tsx can listen to
        window.dispatchEvent(new CustomEvent('storage-fallback', { 
          detail: { message: 'Persistence disabled. Data will not be saved between sessions.' }
        }));
      }
    }
  }

  get length(): number {
    return this.storage.length;
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      const err = error as { code?: number; name?: string } | null;
      const isQuotaExceeded =
        !!err &&
        (err.name === 'QuotaExceededError' || err.code === 22 || err.code === 1014);

      if (isQuotaExceeded) {
        if (quotaErrorHandler) {
          quotaErrorHandler();
        }
        // Swallow quota errors so persistence failure doesn't crash the app.
        return;
      }
      // Other errors should not crash the app; degrade gracefully.
      return;
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch {
      // Ignore errors on remove
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch {
      // Ignore errors on clear
    }
  }
}

export const createSafeStorage = (): Storage => {
  return new SafeStorage();
};
