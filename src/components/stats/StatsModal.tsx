import { useState, useMemo } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, startOfWeek, endOfWeek, addWeeks, addMonths, addYears, eachDayOfInterval, startOfYear, endOfYear } from 'date-fns';
import { cn } from '../../utils/cn';
import { Modal } from '../common/Modal';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMetric = 'minutes' | 'count';
type TimeRange = '7d' | 'all' | 'month' | 'year';

export const StatsModal = ({ isOpen, onClose }: StatsModalProps) => {
  const history = useTimeStore(state => state.history);
  const [metric, setMetric] = useState<ViewMetric>('minutes');
  const [range, setRange] = useState<TimeRange>('7d');
  const [offset, setOffset] = useState(0); // Navigation offset: 0 = current period, -1 = previous, +1 = next

  // --- 1. Total Aggregates (Always All Time) ---
  const totals = useMemo(() => {
    const values = Object.values(history);
    const pomoCount = values.reduce((acc, curr) => acc + (curr.pomodoro || 0), 0);
    const shortCount = values.reduce((acc, curr) => acc + (curr.short || 0), 0);
    const longCount = values.reduce((acc, curr) => acc + (curr.long || 0), 0);
    return {
      pomoCount,
      pomoMins: pomoCount * 25,
      breakMins: (shortCount * 5) + (longCount * 15),
      totalSessions: pomoCount + shortCount + longCount
    };
  }, [history]);

  // Calculate the base date for the current view (with offset)
  const baseDate = useMemo(() => {
    const today = new Date();
    
    switch (range) {
      case '7d': {
        // Start of current week (Monday)
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        return addWeeks(weekStart, offset);
      }
      case 'all': {
        // All time - no offset needed, but we'll use today for consistency
        return today;
      }
      case 'month': {
        // Start of current month
        const monthStart = startOfMonth(today);
        return addMonths(monthStart, offset);
      }
      case 'year': {
        // Start of current year
        const yearStart = startOfYear(today);
        return addYears(yearStart, offset);
      }
      default:
        return today;
    }
  }, [range, offset]);

  // Calculate date range display
  const dateRange = useMemo(() => {
    switch (range) {
      case '7d': {
        const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 });
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      }
      case 'all': {
        const historyKeys = Object.keys(history).sort();
        if (historyKeys.length === 0) return 'No data';
        const firstDate = new Date(historyKeys[0]);
        const lastDate = new Date(historyKeys[historyKeys.length - 1]);
        return `${format(firstDate, 'MMM d, yyyy')} - ${format(lastDate, 'MMM d, yyyy')}`;
      }
      case 'month': {
        const monthStart = startOfMonth(baseDate);
        const monthEnd = endOfMonth(baseDate);
        return `${format(monthStart, 'MMM d')} - ${format(monthEnd, 'MMM d, yyyy')}`;
      }
      case 'year': {
        const yearStart = startOfYear(baseDate);
        const yearEnd = endOfYear(baseDate);
        return `${format(yearStart, 'MMM d, yyyy')} - ${format(yearEnd, 'MMM d, yyyy')}`;
      }
      default:
        return '';
    }
  }, [range, baseDate, history]);

  // --- 2. Graph Data Generation ---
  const graphData = useMemo(() => {
    type DataPoint = {
      label: string;
      fullDate: string;
      work: number;
      rest: number;
      isWeekend?: boolean;
    };
    let dataPoints: DataPoint[] = [];

    if (range === '7d') {
      // Weekly view: Monday to Sunday
      const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

      dataPoints = days.map(date => {
        const key = format(date, 'yyyy-MM-dd');
        const stats = history[key] || { pomodoro: 0, short: 0, long: 0 };
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        return {
          label: format(date, 'EEE'), // Mon, Tue...
          fullDate: format(date, 'MMM d, yyyy'),
          work: metric === 'minutes' ? stats.pomodoro * 25 : stats.pomodoro,
          rest: metric === 'minutes' ? (stats.short * 5) + (stats.long * 15) : (stats.short + stats.long),
          isWeekend
        };
      });
    } else if (range === 'all') {
      // All time view: aggregated by month
      const historyKeys = Object.keys(history).sort();
      if (historyKeys.length === 0) {
        dataPoints = [];
      } else {
        const firstDate = new Date(historyKeys[0]);
        const lastDate = new Date(historyKeys[historyKeys.length - 1]);
        const months = eachMonthOfInterval({ start: startOfMonth(firstDate), end: endOfMonth(lastDate) });

        dataPoints = months.map(monthDate => {
          const monthKeyPrefix = format(monthDate, 'yyyy-MM');

          // Aggregate all days in this month
          let monthlyWork = 0;
          let monthlyRest = 0;
          Object.entries(history).forEach(([key, stats]) => {
            if (key.startsWith(monthKeyPrefix)) {
              monthlyWork += metric === 'minutes' ? stats.pomodoro * 25 : stats.pomodoro;
              monthlyRest += metric === 'minutes' ? (stats.short * 5) + (stats.long * 15) : (stats.short + stats.long);
            }
          });

          return {
            label: format(monthDate, 'MMM'), // Jan, Feb...
            fullDate: format(monthDate, 'MMMM yyyy'),
            work: monthlyWork,
            rest: monthlyRest
          };
        });

        // Limit to last 24 months for readability
        if (dataPoints.length > 24) {
          dataPoints = dataPoints.slice(-24);
        }
      }
    } else if (range === 'month') {
      // Monthly view: all days in the selected month
      const monthStart = startOfMonth(baseDate);
      const monthEnd = endOfMonth(baseDate);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

      dataPoints = days.map(date => {
        const key = format(date, 'yyyy-MM-dd');
        const stats = history[key] || { pomodoro: 0, short: 0, long: 0 };
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        return {
          label: format(date, 'd'), // Day number
          fullDate: format(date, 'MMM d, yyyy'),
          work: metric === 'minutes' ? stats.pomodoro * 25 : stats.pomodoro,
          rest: metric === 'minutes' ? (stats.short * 5) + (stats.long * 15) : (stats.short + stats.long),
          isWeekend
        };
      });
    } else if (range === 'year') {
      // Yearly view: aggregated by month
      const yearStart = startOfYear(baseDate);
      const yearEnd = endOfYear(baseDate);
      const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

      dataPoints = months.map(monthDate => {
        const monthKeyPrefix = format(monthDate, 'yyyy-MM');

        // Aggregate all days in this month
        let monthlyWork = 0;
        let monthlyRest = 0;
        Object.entries(history).forEach(([key, stats]) => {
          if (key.startsWith(monthKeyPrefix)) {
            monthlyWork += metric === 'minutes' ? stats.pomodoro * 25 : stats.pomodoro;
            monthlyRest += metric === 'minutes' ? (stats.short * 5) + (stats.long * 15) : (stats.short + stats.long);
          }
        });

        return {
          label: format(monthDate, 'MMM'), // Jan, Feb...
          fullDate: format(monthDate, 'MMMM yyyy'),
          work: monthlyWork,
          rest: monthlyRest
        };
      });
    }

    // Calculate Totals for bars
    return dataPoints.map(d => ({ ...d, total: d.work + d.rest }));
  }, [history, range, metric, baseDate]);

  // Dynamic Scale
  const maxVal = Math.max(...graphData.map(d => d.total), range === '7d' ? 60 : range === 'month' ? 100 : range === 'all' ? 500 : 500);

  // Navigation handlers
  const handlePrevious = () => {
    setOffset(prev => prev - 1);
  };

  const handleNext = () => {
    setOffset(prev => prev + 1);
  };

  const handleRangeChange = (newRange: TimeRange) => {
    setRange(newRange);
    setOffset(0); // Reset offset when changing range
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Progress">
      <div className="space-y-6 text-white">

        {/* Totals Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-lg p-3 border border-white/5 text-center">
            <div className="text-2xl font-bold">{totals.pomoMins}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/50">Focus Mins</div>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/5 text-center">
            <div className="text-2xl font-bold">{totals.totalSessions}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/50">Sessions</div>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/5 text-center">
            <div className="text-2xl font-bold">{totals.breakMins}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/50">Break Mins</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          {/* Time Range Selector */}
          <div className="flex bg-black/20 p-1 rounded-lg">
            <button
              onClick={() => handleRangeChange('7d')}
              className={cn("px-3 py-1 text-xs font-medium rounded transition-colors", range === '7d' ? "bg-white text-black" : "text-white/50 hover:text-white")}
            >
              7 Days
            </button>
            <button
              onClick={() => handleRangeChange('month')}
              className={cn("px-3 py-1 text-xs font-medium rounded transition-colors", range === 'month' ? "bg-white text-black" : "text-white/50 hover:text-white")}
            >
              Monthly
            </button>
            <button
              onClick={() => handleRangeChange('year')}
              className={cn("px-3 py-1 text-xs font-medium rounded transition-colors", range === 'year' ? "bg-white text-black" : "text-white/50 hover:text-white")}
            >
              Yearly
            </button>
            <button
              onClick={() => handleRangeChange('all')}
              className={cn("px-3 py-1 text-xs font-medium rounded transition-colors", range === 'all' ? "bg-white text-black" : "text-white/50 hover:text-white")}
            >
              All Time
            </button>
          </div>

          {/* Navigation and Date Range */}
          <div className="flex items-center justify-between gap-2">
            {/* Navigation Arrows - Hidden for All Time */}
            {range !== 'all' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white/70 hover:text-white transition-colors"
                  aria-label="Previous period"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white/70 hover:text-white transition-colors"
                  aria-label="Next period"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}
            {range === 'all' && <div />} {/* Spacer when arrows are hidden */}

            {/* Date Range Display */}
            <div className="text-xs text-white/70 font-medium">
              {dateRange}
            </div>

            {/* Metric Toggle */}
            <div className="flex bg-black/20 p-1 rounded-lg">
              <button
                onClick={() => setMetric('minutes')}
                className={cn("px-3 py-1 text-xs font-medium rounded transition-colors", metric === 'minutes' ? "bg-white text-black" : "text-white/50 hover:text-white")}
              >
                Time
              </button>
              <button
                onClick={() => setMetric('count')}
                className={cn("px-3 py-1 text-xs font-medium rounded transition-colors", metric === 'count' ? "bg-white text-black" : "text-white/50 hover:text-white")}
              >
                Count
              </button>
            </div>
          </div>
        </div>

        {/* The Graph */}
        <div className="border-b border-white/10 pb-2">
          <div className={cn(
            "h-48 overflow-y-visible pt-4",
            range === '7d' ? "" : "overflow-x-auto custom-scrollbar"
          )}>
            <div className={cn(
              "h-full flex items-end gap-1 sm:gap-2",
              range === '7d' ? "w-full" : "min-w-fit"
            )}>
              {graphData.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                  No activity recorded yet.
                </div>
              )}

              {graphData.map((d, i) => (
                <div key={i} className={cn(
                  "h-full flex flex-col justify-end group relative",
                  range === '7d' ? "flex-1" : "min-w-[20px] shrink-0"
                )}>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] p-2 rounded whitespace-nowrap z-10 pointer-events-none shadow-xl border border-white/20">
                    <div className="font-bold border-b border-white/20 pb-1 mb-1">{d.fullDate}</div>
                    <div>Focus: {d.work} {metric === 'minutes' ? 'm' : 'x'}</div>
                    <div>Rest: {d.rest} {metric === 'minutes' ? 'm' : 'x'}</div>
                  </div>

                  {/* Bars */}
                  <div className={cn(
                    "w-full rounded-t-sm overflow-hidden flex flex-col-reverse h-full relative",
                    d.isWeekend ? "bg-white/10 border-l border-r border-white/30" : "bg-white/5"
                  )}>
                    {d.isWeekend && (
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(255,255,255,0.1)_3px,rgba(255,255,255,0.1)_6px)] pointer-events-none z-10" />
                    )}
                    <div 
                      style={{ height: `${(d.work / maxVal) * 100}%` }} 
                      className={cn(
                        "w-full transition-all duration-500 relative z-0",
                        d.isWeekend ? "bg-white/70" : "bg-white"
                      )} 
                    />
                    <div 
                      style={{ height: `${(d.rest / maxVal) * 100}%` }} 
                      className={cn(
                        "w-full transition-all duration-500 relative z-0",
                        d.isWeekend ? "bg-white/30" : "bg-white/40"
                      )} 
                    />
                  </div>

                  {/* Label */}
                  <div className="text-[10px] text-center text-white/50 mt-1 truncate w-full">
                    {d.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};