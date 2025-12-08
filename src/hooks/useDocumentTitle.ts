import { useEffect } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { formatTime } from '../utils/timeUtils';

export const useDocumentTitle = () => {
  const { timeLeft, isRunning } = useTimeStore();

  useEffect(() => {
    const timeString = formatTime(timeLeft);
    const status = isRunning ? 'Focusing' : 'Paused';
    document.title = `${timeString} - ${status}`;
  }, [timeLeft, isRunning]);
};

