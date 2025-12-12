import { useEffect, useState } from 'react';
import { events } from '../../services/event.service';

export const VisualBell = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: number | null = null;
    const handleTimerComplete = () => {
      setIsVisible(true);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setIsVisible(false), 1000);
    };

    const unsubscribe = events.on('timer:complete', handleTimerComplete);
    return () => {
      unsubscribe();
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white pointer-events-none z-100 animate-flash" />
  );
};
