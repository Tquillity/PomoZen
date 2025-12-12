import { useState, useMemo } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { format, subDays } from 'date-fns';
import { cn } from '../../utils/cn';
import { Modal } from '../common/Modal';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'minutes' | 'count';

export const StatsModal = ({ isOpen, onClose }: StatsModalProps) => {
  const history = useTimeStore(state => state.history);
  const [viewMode, setViewMode] = useState<ViewMode>('minutes');

  // --- Aggregate Totals ---
  const totals = useMemo(() => {
    const values = Object.values(history);
    const pomoCount = values.reduce((acc, curr) => acc + (curr.pomodoro || 0), 0);
    const shortCount = values.reduce((acc, curr) => acc + (curr.short || 0), 0);
    const longCount = values.reduce((acc, curr) => acc + (curr.long || 0), 0);
    const pomoMins = pomoCount * 25;
    const shortMins = shortCount * 5;
    const longMins = longCount * 15;
    return {
      pomoCount,
      shortCount,
      longCount,
      pomoMins,
      shortMins,
      longMins,
      totalFocusMinutes: pomoMins, // Changed from Hours to Minutes
      totalBreakMins: shortMins + longMins,
      totalSessions: pomoCount + shortCount + longCount
    };
  }, [history]);

  // --- Graph Data (Last 14 Days) ---
  const last14DaysGraph = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const date = subDays(new Date(), 13 - i);
      const key = format(date, 'yyyy-MM-dd');
      const stats = history[key] || { pomodoro: 0, short: 0, long: 0 };

      // Data for "Minutes" Mode
      const workMinutes = stats.pomodoro * 25;
      const restMinutes = (stats.short * 5) + (stats.long * 15);
      const totalMinutes = workMinutes + restMinutes;

      // Data for "Count" Mode
      const workCount = stats.pomodoro;
      const restCount = stats.short + stats.long;
      const totalCount = workCount + restCount;

      return {
        key,
        dayName: format(date, 'EEE'),
        // Dynamic accessors based on viewMode
        minutes: { work: workMinutes, rest: restMinutes, total: totalMinutes },
        count: { work: workCount, rest: restCount, total: totalCount }
      };
    });
  }, [history]);

  // Calculate Max Scale for Graph Height
  const maxValue = useMemo(() => {
    const values = last14DaysGraph.map(d => d[viewMode].total);
    // Ensure minimum scale so graph isn't flat if data is 0 (60 mins or 5 sessions)
    const minScale = viewMode === 'minutes' ? 60 : 5;
    return Math.max(...values, minScale);
  }, [last14DaysGraph, viewMode]);

  // --- Heatmap Data (Last 14 Days) ---
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

  const getHeatmapClass = (count: number) => {
    if (count === 0) return "bg-white/10";
    if (count <= 2) return "bg-white/30";
    if (count <= 5) return "bg-white/60";
    return "bg-white";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Progress">
      <div className="space-y-8 text-white">

        {/* 1. High Level Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-black/10 rounded-lg p-2 border border-white/5">
            <div className="text-2xl font-bold">{totals.totalFocusMinutes}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/60">Focus Mins</div>
          </div>
          <div className="bg-black/10 rounded-lg p-2 border border-white/5">
            <div className="text-2xl font-bold">{totals.totalSessions}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/60">Sessions</div>
          </div>
          <div className="bg-black/10 rounded-lg p-2 border border-white/5">
            <div className="text-2xl font-bold">{totals.totalBreakMins}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/60">Break Mins</div>
          </div>
        </div>

        {/* 2. Detailed Breakdown Table */}
        <div>
            <h3 className="font-semibold uppercase text-xs tracking-wider mb-2 opacity-80">Detailed Breakdown</h3>
            <div className="grid grid-cols-3 gap-px bg-white/10 rounded-lg overflow-hidden border border-white/10 text-sm">
                {/* Header */}
                <div className="bg-white/10 p-2 text-[10px] sm:text-xs font-bold text-center">Pomodoro</div>
                <div className="bg-white/10 p-2 text-[10px] sm:text-xs font-bold text-center">Short Break</div>
                <div className="bg-white/10 p-2 text-[10px] sm:text-xs font-bold text-center">Long Break</div>

                {/* Time */}
                <div className="bg-black/10 p-2 text-center">{totals.pomoMins}m</div>
                <div className="bg-black/10 p-2 text-center">{totals.shortMins}m</div>
                <div className="bg-black/10 p-2 text-center">{totals.longMins}m</div>
                {/* Counts */}
                <div className="bg-black/10 p-2 text-center text-xs opacity-50">{totals.pomoCount}x</div>
                <div className="bg-black/10 p-2 text-center text-xs opacity-50">{totals.shortCount}x</div>
                <div className="bg-black/10 p-2 text-center text-xs opacity-50">{totals.longCount}x</div>
            </div>
        </div>

        {/* 3. Interactive Graph */}
        <div>
            <div className="flex justify-between items-end mb-4">
                <h3 className="font-semibold uppercase text-xs tracking-wider opacity-80">
                    Activity (Last 14 Days)
                </h3>
                {/* Toggle Switch */}
                <div className="flex bg-black/20 p-0.5 rounded-lg border border-white/10">
                    <button
                        onClick={() => setViewMode('minutes')}
                        className={cn(
                            "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                            viewMode === 'minutes' ? "bg-white text-black shadow-sm" : "text-white/50 hover:text-white"
                        )}
                    >
                        Time
                    </button>
                    <button
                        onClick={() => setViewMode('count')}
                        className={cn(
                            "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                            viewMode === 'count' ? "bg-white text-black shadow-sm" : "text-white/50 hover:text-white"
                        )}
                    >
                        Count
                    </button>
                </div>
            </div>
            <div className="h-40 flex items-end justify-between gap-2 px-2 border-b border-white/10 pb-1">
                {last14DaysGraph.map((day) => {
                    const data = day[viewMode];
                    const workHeight = (data.work / maxValue) * 100;
                    const restHeight = (data.rest / maxValue) * 100;

                    return (
                        <div key={day.key} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] p-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-xl border border-white/20 text-center backdrop-blur-sm">
                                <div className="font-bold mb-1 text-white/90 border-b border-white/20 pb-1">{day.dayName}</div>
                                <div className="flex items-center gap-2 justify-between">
                                    <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                                    <span>Work: {data.work}{viewMode === 'minutes' ? 'm' : 'x'}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-between mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-white/40 inline-block"></span>
                                    <span>Rest: {data.rest}{viewMode === 'minutes' ? 'm' : 'x'}</span>
                                </div>
                            </div>

                            {/* The Bar Stack */}
                            {/* FIX: Added 'h-full' here so the container fills the 160px height */}
                            <div className="w-full h-full flex flex-col-reverse justify-start rounded-sm overflow-hidden relative min-h-[4px] bg-white/5">
                                {(data.total > 0) ? (
                                    <>
                                        <div
                                            style={{ height: `${Math.max(workHeight, 0)}%` }}
                                            className="w-full bg-white transition-all duration-500"
                                        />
                                        <div
                                            style={{ height: `${Math.max(restHeight, 0)}%` }}
                                            className="w-full bg-white/40 transition-all duration-500"
                                        />
                                    </>
                                ) : (
                                    <div className="h-full w-full bg-transparent" />
                                )}
                            </div>
                            <span className="text-[10px] text-white/50 font-mono">{day.dayName.charAt(0)}</span>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span className="text-[10px] text-white/70">Work</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/40" />
                    <span className="text-[10px] text-white/70">Rest</span>
                </div>
            </div>
        </div>

        {/* 4. Heatmap */}
        <div>
          <h3 className="font-semibold uppercase text-xs tracking-wider mb-3 opacity-80">Consistency (Last 14 Days)</h3>
          <div className="flex justify-between gap-1">
            {last14Days.map((day) => (
              <div key={day.key} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={cn("w-full aspect-square rounded-sm transition-colors cursor-default border border-white/5", getHeatmapClass(day.count))}
                  title={`${format(day.date, 'MMM d')}: ${day.count} Sessions`}
                />
                <div className="text-[8px] text-white/40 font-mono">
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