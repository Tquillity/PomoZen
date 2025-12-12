import { useTimeStore } from '../../store/useTimeStore';
import { playClick } from '../../services/sound.service';
import { cn } from '../../utils/cn';

export const TimerControls = () => {
  const isRunning = useTimeStore(state => state.isRunning);
  const startTimer = useTimeStore(state => state.startTimer);
  const pauseTimer = useTimeStore(state => state.pauseTimer);
  const resetTimer = useTimeStore(state => state.resetTimer);

  const handleStart = () => {
    playClick();
    startTimer();
  };

  const handlePause = () => {
    playClick();
    pauseTimer();
  };

  const handleReset = () => {
    playClick();
    resetTimer();
  };

  return (
    <div className="flex gap-2 sm:gap-4 mb-[10px] sm:mb-[13px] md:mb-[20px] z-10">
      <button
          onClick={isRunning ? handlePause : handleStart}
          className={cn(
            "px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-lg sm:text-xl md:text-2xl font-bold rounded-lg shadow-xl cursor-pointer transition-transform active:scale-95 uppercase w-32 sm:w-40 md:w-48",
            "bg-white text-(--theme-primary) hover:bg-gray-100"
          )}
      >
          {isRunning ? 'Pause' : 'Start'}
      </button>

      <button
          onClick={handleReset}
          className="px-3 sm:px-4 py-3 sm:py-4 text-lg sm:text-xl md:text-2xl font-bold rounded-lg shadow-xl cursor-pointer transition-transform active:scale-95 bg-white/20 text-white hover:bg-white/30"
          aria-label="Reset Timer"
      >
          ↺
      </button>
    </div>
  );
};
