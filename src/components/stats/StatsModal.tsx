import { useEffect, useMemo } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { format, subDays } from 'date-fns';
import { cn } from '../../utils/cn';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal = ({ isOpen, onClose }: StatsModalProps) => {
  const history = useTimeStore(state => state.history);
  const pomodoroDuration = useTimeStore(state => state.timeLeft); // Just for type safety, really we want duration from settings but let's keep it simple. 
  // Actually, calculating total hours is tricky if duration changes. Let's just count Pomodoros.
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Generate last 14 days
  const last14Days = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const date = subDays(new Date(), 13 - i);
      const key = format(date, 'yyyy-MM-dd');
      return {
        date,
        key,
        count: history[key] || 0
      };
    });
  }, [history]);

  const totalPomodoros = Object.values(history).reduce((a, b) => a + b, 0);
  
  // Basic heuristic: 25 mins per pomodoro
  const totalHours = Math.round((totalPomodoros * 25) / 60 * 10) / 10;

  if (!isOpen) return null;

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-gray-200";
    if (count <= 2) return "bg-green-200";
    if (count <= 5) return "bg-green-400";
    return "bg-green-600";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-gray-800"
        role="dialog"
        aria-modal="true"
        aria-label="Statistics"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Close Stats"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-3xl font-bold text-gray-800">{totalPomodoros}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Total Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{totalHours}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Est. Hours</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-3">Last 14 Days</h3>
            <div className="flex justify-between gap-1">
              {last14Days.map((day) => (
                <div key={day.key} className="flex flex-col items-center gap-1 flex-1">
                  <div 
                    className={cn("w-full aspect-square rounded-sm", getIntensityClass(day.count))}
                    title={`${format(day.date, 'MMM d')}: ${day.count} sessions`}
                  />
                  <div className="text-[9px] text-gray-400">
                    {format(day.date, 'd')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
