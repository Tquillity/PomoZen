import { useEffect, useRef } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { playAlarm, sendNotification, triggerVisualBell } from '../services/sound.service';

export const useTimerEffects = () => {
  const timeLeft = useTimeStore(state => state.timeLeft);
  const mode = useTimeStore(state => state.mode);
  const hasHandledComplete = useRef(false);

  useEffect(() => {
    if (timeLeft === 0 && !hasHandledComplete.current) {
      hasHandledComplete.current = true;
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
      hasHandledComplete.current = false;
    }
  }, [timeLeft, mode]);
};
