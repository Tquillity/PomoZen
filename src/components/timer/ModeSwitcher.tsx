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
    <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 md:mb-8 bg-black/20 p-1 rounded-full z-10">
      {(['pomodoro', 'short', 'long'] as TimerMode[]).map((m) => (
        <button
          key={m}
          onClick={() => handleModeChange(m)}
          className={cn(
            "px-2 sm:px-3 md:px-4 py-1 rounded-full capitalize text-xs sm:text-sm font-medium transition-all cursor-pointer",
            mode === m ? "bg-black/20 text-white font-bold" : "text-white/70 hover:bg-black/10"
          )}
        >
          {m}
        </button>
      ))}
    </div>
  );
};

