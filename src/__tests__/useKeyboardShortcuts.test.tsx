import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useTimeStore } from '../store/useTimeStore';
import { useSettingsStore } from '../store/useSettingsStore';

vi.mock('../store/useTimeStore');
vi.mock('../store/useSettingsStore');

describe('useKeyboardShortcuts', () => {
  const mockStartTimer = vi.fn();
  const mockPauseTimer = vi.fn();
  const mockResetTimer = vi.fn();
  const mockToggleSound = vi.fn();
  const mockToggleFocusMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useTimeStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      startTimer: mockStartTimer,
      pauseTimer: mockPauseTimer,
      resetTimer: mockResetTimer,
      isRunning: false
    });
    
    (useSettingsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      toggleSound: mockToggleSound,
      toggleFocusMode: mockToggleFocusMode
    });
  });

  it('should start timer on space when not running', () => {
    renderHook(() => useKeyboardShortcuts());
    
    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);
    
    expect(mockStartTimer).toHaveBeenCalled();
  });

  it('should pause timer on space when running', () => {
    (useTimeStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      startTimer: mockStartTimer,
      pauseTimer: mockPauseTimer,
      resetTimer: mockResetTimer,
      isRunning: true
    });
    
    renderHook(() => useKeyboardShortcuts());
    
    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);
    
    expect(mockPauseTimer).toHaveBeenCalled();
  });

  it('should reset timer on r key', () => {
    renderHook(() => useKeyboardShortcuts());
    
    const event = new KeyboardEvent('keydown', { key: 'r' });
    window.dispatchEvent(event);
    
    expect(mockResetTimer).toHaveBeenCalled();
  });

  it('should toggle sound on m key', () => {
    renderHook(() => useKeyboardShortcuts());
    
    const event = new KeyboardEvent('keydown', { key: 'm' });
    window.dispatchEvent(event);
    
    expect(mockToggleSound).toHaveBeenCalled();
  });

  it('should toggle focus mode on f key', () => {
    renderHook(() => useKeyboardShortcuts());
    
    const event = new KeyboardEvent('keydown', { key: 'f' });
    window.dispatchEvent(event);
    
    expect(mockToggleFocusMode).toHaveBeenCalled();
  });

  it('should ignore shortcuts when in input field', () => {
    renderHook(() => useKeyboardShortcuts());
    
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    
    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);
    
    expect(mockStartTimer).not.toHaveBeenCalled();
    
    document.body.removeChild(input);
  });

  it('should ignore shortcuts when in textarea', () => {
    renderHook(() => useKeyboardShortcuts());
    
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();
    
    const event = new KeyboardEvent('keydown', { key: 'r' });
    window.dispatchEvent(event);
    
    expect(mockResetTimer).not.toHaveBeenCalled();
    
    document.body.removeChild(textarea);
  });

  it('should ignore shortcuts when in button', () => {
    renderHook(() => useKeyboardShortcuts());
    
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();
    
    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);
    
    expect(mockStartTimer).not.toHaveBeenCalled();
    
    document.body.removeChild(button);
  });

  it('should cleanup event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyboardShortcuts());
    
    unmount();
    
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    removeSpy.mockRestore();
  });
});
