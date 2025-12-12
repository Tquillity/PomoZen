import { useEffect, useState } from 'react';
import { events } from '../../services/event.service';

export const VisualBell = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleTimerComplete = () => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 1000);
    };

    return events.on('timer:complete', handleTimerComplete);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white pointer-events-none z-100 animate-flash" />
  );
};
