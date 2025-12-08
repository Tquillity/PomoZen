import { useTimeStore } from '../../store/useTimeStore';
import { formatTime } from '../../utils/timeUtils';

export const TimerDisplay = () => {
  const timeLeft = useTimeStore(state => state.timeLeft);
  
  return (
    <div className="text-[8rem] leading-none font-bold text-white mb-8 font-mono drop-shadow-lg tabular-nums">
      {formatTime(timeLeft)}
    </div>
  );
};

