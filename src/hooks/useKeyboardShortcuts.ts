import { useEffect } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { useSettingsStore } from '../store/useSettingsStore';

export const useKeyboardShortcuts = () => {
  const { startTimer, pauseTimer, resetTimer, isRunning } = useTimeStore();
  const { toggleSound, toggleFocusMode } = useSettingsStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault(); // Prevent scrolling
          if (isRunning) pauseTimer();
          else startTimer();
          break;
        case 'r':
          resetTimer();
          break;
        case 'm':
          toggleSound();
          break;
        case 'f':
          toggleFocusMode();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, startTimer, pauseTimer, resetTimer, toggleSound, toggleFocusMode]);
};

