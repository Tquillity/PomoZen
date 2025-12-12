import { useEffect, useRef } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { useSettingsStore } from '../store/useSettingsStore';

export const useKeyboardShortcuts = () => {
  const { startTimer, pauseTimer, resetTimer, isRunning } = useTimeStore();
  const { toggleSound, toggleFocusMode } = useSettingsStore();
  
  // Use refs to access latest values without causing effect re-runs
  const actionsRef = useRef({ startTimer, pauseTimer, resetTimer, toggleSound, toggleFocusMode });
  const isRunningRef = useRef(isRunning);
  
  useEffect(() => {
    actionsRef.current = { startTimer, pauseTimer, resetTimer, toggleSound, toggleFocusMode };
    isRunningRef.current = isRunning;
  }, [startTimer, pauseTimer, resetTimer, toggleSound, toggleFocusMode, isRunning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const tag = active?.tagName?.toLowerCase();

      // Ignore while interacting with form controls / interactive elements.
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        tag === 'button' ||
        tag === 'a' ||
        active?.isContentEditable
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault(); // Prevent scrolling
          if (isRunningRef.current) actionsRef.current.pauseTimer();
          else actionsRef.current.startTimer();
          break;
        case 'r':
          actionsRef.current.resetTimer();
          break;
        case 'm':
          actionsRef.current.toggleSound();
          break;
        case 'f':
          actionsRef.current.toggleFocusMode();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty deps - handler uses refs for latest values
};

