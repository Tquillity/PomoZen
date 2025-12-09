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
  
  // Generate last 7 days for the graph
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const key = format(date, 'yyyy-MM-dd');
      const stats = history[key] || { pomodoro: 0, short: 0, long: 0 };
      
      const workMinutes = stats.pomodoro * 25;
      const restMinutes = (stats.short * 5) + (stats.long * 15);
      const totalMinutes = workMinutes + restMinutes;

      return {
        date,
        key,
        dayName: format(date, 'EEE'),
        workMinutes,
        restMinutes,
        totalMinutes
      };
    });
  }, [history]);

  // Generate last 14 days for the heatmap
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

  const maxTotalMinutes = Math.max(...last7Days.map(d => d.totalMinutes), 60); // Minimum scale of 1 hour

  const totalPomodoros = Object.values(history).reduce((a, b) => a + (b.pomodoro || 0), 0);
  const totalShort = Object.values(history).reduce((a, b) => a + (b.short || 0), 0);
  const totalLong = Object.values(history).reduce((a, b) => a + (b.long || 0), 0);
  
  // Basic heuristic: 25 mins per pomodoro
  const totalHours = Math.round((totalPomodoros * 25) / 60 * 10) / 10;
  const totalBreaks = totalShort + totalLong;

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-gray-200";
    if (count <= 2) return "bg-green-200";
    if (count <= 5) return "bg-green-400";
    return "bg-green-600";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Progress">
      <div className="space-y-8">
        
        {/* Summary Metrics */}
        <div className="flex justify-around text-center gap-2">
          <div>
            <div className="text-3xl font-bold text-white">{totalHours}</div>
            <div className="text-xs text-white/80 uppercase tracking-wider">Focus Hours</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{totalBreaks}</div>
            <div className="text-xs text-white/80 uppercase tracking-wider">Total Breaks</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{totalPomodoros}</div>
            <div className="text-xs text-white/80 uppercase tracking-wider">Sessions</div>
          </div>
        </div>

        {/* CSS Stacked Bar Chart */}
        <div>
            <h3 className="font-semibold text-white uppercase text-xs tracking-wider mb-4">Work vs Rest (Last 7 Days)</h3>
            <div className="h-40 flex items-end justify-between gap-2 px-2">
                {last7Days.map((day) => {
                    const workHeight = (day.workMinutes / maxTotalMinutes) * 100;
                    const restHeight = (day.restMinutes / maxTotalMinutes) * 100;
                    
                    return (
                        <div key={day.key} className="flex-1 flex flex-col items-center gap-1 group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] p-1 rounded pointer-events-none whitespace-nowrap z-10">
                                {day.workMinutes}m Work / {day.restMinutes}m Rest
                            </div>

                            <div className="w-full flex flex-col-reverse justify-start h-full max-h-32 bg-white/5 rounded-sm overflow-hidden relative">
                                {day.totalMinutes > 0 && (
                                    <>
                                        <div 
                                            style={{ height: `${workHeight}%` }} 
                                            className="w-full bg-(--theme-primary) transition-all duration-500"
                                        />
                                        <div 
                                            style={{ height: `${restHeight}%` }} 
                                            className="w-full bg-blue-300/80 transition-all duration-500"
                                        />
                                    </>
                                )}
                            </div>
                            <span className="text-[10px] text-white/60">{day.dayName}</span>
                        </div>
                    );
                })}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-(--theme-primary)" />
                    <span className="text-[10px] text-white/70">Work</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-300/80" />
                    <span className="text-[10px] text-white/70">Rest</span>
                </div>
            </div>
        </div>

        <hr className="border-white/10" />

        {/* Heatmap */}
        <div>
          <h3 className="font-semibold text-white uppercase text-xs tracking-wider mb-3">Consistency (Last 14 Days)</h3>
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
