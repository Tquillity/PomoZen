import { useEffect } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { formatTime } from '../utils/timeUtils';

export const useDocumentTitle = () => {
  const { timeLeft, isRunning } = useTimeStore();

  useEffect(() => {
    const timeString = formatTime(timeLeft);

    if (isRunning) {
      // When running, show dynamic countdown
      document.title = `${timeString} - Focusing - PomoZen`;
    } else {
      // When paused/stopped, show SEO-friendly title with keyword first
      document.title = 'Pomodoro Timer Online | PomoZen Focus Tool';
    }
  }, [timeLeft, isRunning]);
};

