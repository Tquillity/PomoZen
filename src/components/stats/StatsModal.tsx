import { useMemo } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { format, subDays } from 'date-fns';
import { cn } from '../../utils/cn';
import { Modal } from '../common/Modal';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal = ({ isOpen, onClose }: StatsModalProps) => {
  const history = useTimeStore(state => state.history); 
  
  // Generate last 14 days
  const last14Days = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const date = subDays(new Date(), 13 - i);
      const key = format(date, 'yyyy-MM-dd');
      const stats = history[key] || { pomodoro: 0, short: 0, long: 0 };
      return {
        date,
        key,
        count: stats.pomodoro,
        stats
      };
    });
  }, [history]);

  const totalPomodoros = Object.values(history).reduce((a, b) => a + (b.pomodoro || 0), 0);
  const totalShort = Object.values(history).reduce((a, b) => a + (b.short || 0), 0);
  const totalLong = Object.values(history).reduce((a, b) => a + (b.long || 0), 0);
  
  // Basic heuristic: 25 mins per pomodoro
  const totalHours = Math.round((totalPomodoros * 25) / 60 * 10) / 10;

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-gray-200";
    if (count <= 2) return "bg-green-200";
    if (count <= 5) return "bg-green-400";
    return "bg-green-600";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Progress">
      <div className="space-y-6">
        <div className="flex justify-around text-center gap-2">
          <div>
            <div className="text-3xl font-bold text-white">{totalHours}</div>
            <div className="text-xs text-white/80 uppercase tracking-wider">Total Focus Hours</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{totalShort}</div>
            <div className="text-xs text-white/80 uppercase tracking-wider">Total Short Breaks</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{totalLong}</div>
            <div className="text-xs text-white/80 uppercase tracking-wider">Total Long Breaks</div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white uppercase text-xs tracking-wider mb-3">Last 14 Days</h3>
          <div className="flex justify-between gap-1">
            {last14Days.map((day) => (
              <div key={day.key} className="flex flex-col items-center gap-1 flex-1">
                <div 
                  className={cn("w-full aspect-square rounded-sm transition-colors cursor-help", getIntensityClass(day.count))}
                  title={`${format(day.date, 'MMM d')}: ${day.count} Pomo, ${day.stats.short} Short, ${day.stats.long} Long`}
                />
                <div className="text-[9px] text-gray-400">
                  {format(day.date, 'd')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
