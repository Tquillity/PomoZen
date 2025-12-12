import { useEffect } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { formatTime } from '../utils/timeUtils';

export const useDocumentTitle = () => {
  const { timeLeft, isRunning } = useTimeStore();

  useEffect(() => {
    const timeString = formatTime(timeLeft);

    if (isRunning) {
      document.title = `${timeString} - Focusing - PomoZen`;
    } else {
      document.title = 'Pomodoro Timer Online | PomoZen Focus Tool';
    }
  }, [timeLeft, isRunning]);
};

