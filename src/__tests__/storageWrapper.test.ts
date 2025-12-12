import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('storageWrapper', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  describe('createSafeStorage', () => {
    it('should create storage that uses localStorage when available', async () => {
      const { createSafeStorage } = await import('../utils/storageWrapper');
      const storage = createSafeStorage();

      storage.setItem('test', 'value');

      expect(storage.getItem('test')).toBe('value');
      expect(localStorage.getItem('test')).toBe('value');
    });

    it('should handle getItem', async () => {
      const { createSafeStorage } = await import('../utils/storageWrapper');
      const storage = createSafeStorage();
      localStorage.setItem('existing', 'data');

      expect(storage.getItem('existing')).toBe('data');
      expect(storage.getItem('nonexistent')).toBeNull();
    });

    it('should handle setItem', async () => {
      const { createSafeStorage } = await import('../utils/storageWrapper');
      const storage = createSafeStorage();

      storage.setItem('key', 'value');

      expect(storage.getItem('key')).toBe('value');
    });

    it('should handle removeItem', async () => {
      const { createSafeStorage } = await import('../utils/storageWrapper');
      const storage = createSafeStorage();
      storage.setItem('key', 'value');

      storage.removeItem('key');

      expect(storage.getItem('key')).toBeNull();
    });

    it('should handle clear', async () => {
      const { createSafeStorage } = await import('../utils/storageWrapper');
      const storage = createSafeStorage();
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');

      storage.clear();

      expect(storage.length).toBe(0);
    });

    it('should handle key', async () => {
      const { createSafeStorage } = await import('../utils/storageWrapper');
      const storage = createSafeStorage();
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');

      expect(storage.key(0)).toBe('key1');
      expect(storage.key(1)).toBe('key2');
    });

    it('should handle length', async () => {
      const { createSafeStorage } = await import('../utils/storageWrapper');
      const storage = createSafeStorage();
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');

      expect(storage.length).toBe(2);
    });
  });

  describe('quota error handling', () => {
    it('should not crash when localStorage throws QuotaExceededError', async () => {
      const handler = vi.fn();
      const { createSafeStorage, setStorageQuotaErrorHandler } = await import('../utils/storageWrapper');
      setStorageQuotaErrorHandler(handler);
      const storage = createSafeStorage();

      const original = localStorage.setItem.bind(localStorage);
      Object.defineProperty(localStorage, 'setItem', {
        configurable: true,
        writable: true,
        value: vi.fn(() => {
          const DomEx = globalThis.DOMException;
          const err = new DomEx('Quota exceeded', 'QuotaExceededError');
          // Some environments don't expose DOMException.code; the implementation
          // under test accepts either code or name match.
          try {
            Object.defineProperty(err, 'code', { value: 22 });
          } catch {
            // ignore
          }
          throw err;
        }),
      });

      expect(() => {
        storage.setItem('key', 'value');
      }).not.toThrow();

      Object.defineProperty(localStorage, 'setItem', {
        configurable: true,
        writable: true,
        value: original,
      });
    });

    it('should not crash on quota error', async () => {
      const handler = vi.fn();
      const { createSafeStorage, setStorageQuotaErrorHandler } = await import('../utils/storageWrapper');
      setStorageQuotaErrorHandler(handler);
      const storage = createSafeStorage();

      const original = localStorage.setItem.bind(localStorage);
      Object.defineProperty(localStorage, 'setItem', {
        configurable: true,
        writable: true,
        value: vi.fn(() => {
          const DomEx = globalThis.DOMException;
          const err = new DomEx('Quota exceeded', 'QuotaExceededError');
          try {
            Object.defineProperty(err, 'code', { value: 22 });
          } catch {
            // ignore
          }
          throw err;
        }),
      });

      expect(() => {
        storage.setItem('key', 'value');
      }).not.toThrow();

      Object.defineProperty(localStorage, 'setItem', {
        configurable: true,
        writable: true,
        value: original,
      });
    });
  });

  describe('fallback to MemoryStorage', () => {
    it('should fallback to MemoryStorage when localStorage is unavailable', async () => {
      const { createSafeStorage } = await import('../utils/storageWrapper');
      const originalDesc = Object.getOwnPropertyDescriptor(window, 'localStorage');
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() {
          throw new Error('localStorage unavailable');
        },
      });

      const storage = createSafeStorage();
      storage.setItem('test', 'value');
      expect(storage.getItem('test')).toBe('value');

      if (originalDesc) Object.defineProperty(window, 'localStorage', originalDesc);
    });

    it('should dispatch storage-fallback event when falling back', async () => {
      const eventSpy = vi.spyOn(window, 'dispatchEvent');
      const { createSafeStorage } = await import('../utils/storageWrapper');
      const originalDesc = Object.getOwnPropertyDescriptor(window, 'localStorage');
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() {
          throw new Error('localStorage unavailable');
        },
      });

      createSafeStorage();

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'storage-fallback'
        })
      );

      if (originalDesc) Object.defineProperty(window, 'localStorage', originalDesc);
      eventSpy.mockRestore();
    });
  });
});
