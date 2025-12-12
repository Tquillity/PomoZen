import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFocusMode } from '../hooks/useFocusMode';
import { useSettingsStore } from '../store/useSettingsStore';

vi.mock('../store/useSettingsStore');

describe('useFocusMode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock document.exitFullscreen
    document.exitFullscreen = vi.fn(() => Promise.resolve());
    
    // Mock fullscreenElement
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: null,
      configurable: true
    });
  });

  it('should exit fullscreen when focus mode is disabled and fullscreen is active', async () => {
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: document.documentElement,
      configurable: true
    });
    
    (useSettingsStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const state = { isFocusMode: false };
      return selector ? selector(state) : state;
    });

    renderHook(() => useFocusMode());

    await waitFor(() => {
      expect(document.exitFullscreen).toHaveBeenCalled();
    });
  });

  it('should not exit fullscreen when focus mode is enabled', () => {
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: document.documentElement,
      configurable: true
    });
    
    (useSettingsStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const state = { isFocusMode: true };
      return selector ? selector(state) : state;
    });

    renderHook(() => useFocusMode());

    expect(document.exitFullscreen).not.toHaveBeenCalled();
  });

  it('should not exit fullscreen when not in fullscreen', () => {
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: null,
      configurable: true
    });
    
    (useSettingsStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const state = { isFocusMode: false };
      return selector ? selector(state) : state;
    });

    renderHook(() => useFocusMode());

    expect(document.exitFullscreen).not.toHaveBeenCalled();
  });

  it('should handle fullscreen API errors gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: document.documentElement,
      configurable: true
    });
    
    document.exitFullscreen = vi.fn(() => Promise.reject(new Error('Fullscreen error')));
    
    (useSettingsStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const state = { isFocusMode: false };
      return selector ? selector(state) : state;
    });

    expect(() => {
      renderHook(() => useFocusMode());
    }).not.toThrow();
    
    consoleWarnSpy.mockRestore();
  });
});
