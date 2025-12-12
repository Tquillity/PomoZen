import { useTimeStore } from '../../store/useTimeStore';
import { playClick } from '../../services/sound.service';
import type { TimerMode } from '../../types';
import { cn } from '../../utils/cn';

export const ModeSwitcher = () => {
  const mode = useTimeStore(state => state.mode);
  const setMode = useTimeStore(state => state.setMode);

  const handleModeChange = (m: TimerMode) => {
    playClick();
    setMode(m);
  };

  return (
    <div className="flex gap-1 sm:gap-2 mb-[14px] sm:mb-[22px] md:mb-[29px] bg-black/20 p-1 rounded-full z-10">
      {(['pomodoro', 'short', 'long'] as TimerMode[]).map((m) => (
        <button
          key={m}
          onClick={() => handleModeChange(m)}
          className={cn(
            // ALWAYS bold to prevent width jumping
            "px-2 sm:px-3 md:px-4 py-2 rounded-full capitalize text-xs sm:text-sm font-bold transition-all cursor-pointer",
            // Active: High opacity, background. Inactive: Lower opacity, hover effect.
            mode === m ? "bg-black/20 text-white shadow-sm" : "text-white/60 hover:text-white hover:bg-black/10"
          )}
        >
          {m}
        </button>
      ))}
    </div>
  );
};

