import { useEffect, useRef } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { playAlarm, sendNotification, triggerVisualBell } from '../services/sound.service';

export const useTimerEffects = () => {
  const timeLeft = useTimeStore(state => state.timeLeft);
  const mode = useTimeStore(state => state.mode);
  
  // Ref to track if we've already handled the 0 state to prevent duplicate effects
  const hasHandledComplete = useRef(false);

  useEffect(() => {
    if (timeLeft === 0 && !hasHandledComplete.current) {
      hasHandledComplete.current = true;
      
      // Trigger Side Effects
      const { soundEnabled } = useSettingsStore.getState();
      
      triggerVisualBell();
      
      if (soundEnabled) {
        playAlarm();
      }
      
      if (mode === 'pomodoro') {
        sendNotification("Break Time!", "Great job! Take a short break.");
      } else {
        sendNotification("Back to Work!", "Break is over. Let's focus.");
      }
      
    } else if (timeLeft > 0) {
      // Reset the flag when time is reset
      hasHandledComplete.current = false;
    }
  }, [timeLeft, mode]);

  // Subscribe to timer complete event for other logic (like Tasks)
  // This is handled via the Event Bus as requested
  // Note: The store emits 'timer:complete', we can listen here if needed, 
  // but App.tsx will handle the task update logic via event bus.
};
