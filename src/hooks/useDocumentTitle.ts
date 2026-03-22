import { useEffect } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { formatTime } from '../utils/timeUtils';

export const useDocumentTitle = () => {
  const { timeLeft, isRunning } = useTimeStore();

  useEffect(() => {
    const timeString = formatTime(timeLeft);

    if (isRunning) {
      document.title = `${timeString} | Focusing with PomoZen`;
    } else {
      document.title = 'Free Pomodoro Timer Online for Focus and Study | PomoZen';
    }
  }, [timeLeft, isRunning]);
};

