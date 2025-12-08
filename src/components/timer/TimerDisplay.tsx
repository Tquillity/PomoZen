import { useTimeStore } from '../../store/useTimeStore';
import { formatTime } from '../../utils/timeUtils';

export const TimerDisplay = () => {
  const timeLeft = useTimeStore(state => state.timeLeft);

  return (
    <div className="text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] leading-none font-bold text-white mb-4 sm:mb-6 md:mb-8 font-mono drop-shadow-lg tabular-nums">
      {formatTime(timeLeft)}
    </div>
  );
};

