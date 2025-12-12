import { useTimeStore } from '../../store/useTimeStore';
import { formatTime } from '../../utils/timeUtils';

export const TimerDisplay = () => {
  const timeLeft = useTimeStore(state => state.timeLeft);
  const isRunning = useTimeStore(state => state.isRunning);

  return (
    <div className="text-center">
      <h1 className="sr-only">PomoZen - Pomodoro Timer</h1>
      <div
        className="text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] leading-none font-bold text-white mb-[13px] sm:mb-[20px] md:mb-[26px] font-mono drop-shadow-lg tabular-nums"
        role="timer"
        aria-live={isRunning ? "off" : "polite"}
        aria-atomic="true"
      >
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};