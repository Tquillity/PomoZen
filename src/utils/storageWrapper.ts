let quotaErrorHandler: (() => void) | null = null;

export const setStorageQuotaErrorHandler = (handler: () => void) => {
  quotaErrorHandler = handler;
};

class SafeStorage implements Storage {
  private storage: Storage;

  constructor() {
    this.storage = localStorage;
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
      if (error instanceof DOMException && (error.code === 22 || error.code === 1014 || error.name === 'QuotaExceededError')) {
        if (quotaErrorHandler) {
          quotaErrorHandler();
        }
      }
      throw error;
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
