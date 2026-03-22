import { useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { playAlarm, sendNotification } from '../services/sound.service';
import { events } from '../services/event.service';
import { useTimeStore } from '../store/useTimeStore';
import { getScheduledBreakMode } from '../utils/timerSchedule';

export const useTimerEffects = () => {
  useEffect(() => {
    const unsubscribe = events.on('timer:complete', (completedMode) => {
      const { soundEnabled, notificationsEnabled } = useSettingsStore.getState();

      if (soundEnabled) {
        playAlarm();
      }

      if (notificationsEnabled) {
        if (completedMode === 'pomodoro') {
          const pomodorosCompleted = useTimeStore.getState().pomodorosCompleted;
          const nextBreakMode = getScheduledBreakMode(pomodorosCompleted);

          sendNotification(
            'Break Time!',
            `Great job! Take a ${nextBreakMode === 'long' ? 'long' : 'short'} break.`
          );
        } else {
          sendNotification('Back to Work!', "Break is over. Let's focus.");
        }
      }

    });

    return unsubscribe;
  }, []);
};
