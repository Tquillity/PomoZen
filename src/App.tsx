import { useTimeStore } from './store/useTimeStore';
import { TaskBoard } from './components/TaskBoard';
import { useTheme } from './hooks/useTheme';
import { playClick, requestNotificationPermission } from './services/sound.service';
import clsx from 'clsx';
import type { TimerMode } from './types';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

function App() {
  // Initialize Theme Engine
  useTheme();

  const { timeLeft, isRunning, mode, startTimer, pauseTimer, resetTimer, setMode } = useTimeStore();

  const handleStart = () => {
    playClick();
    requestNotificationPermission(); // Ask on first interaction
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

  const handleModeChange = (m: TimerMode) => {
    playClick();
    setMode(m);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 transition-colors duration-500">
      
      {/* Mode Switcher */}
      <div className="flex gap-2 mb-8 bg-black/20 p-1 rounded-full z-10">
        {(['pomodoro', 'short', 'long'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={clsx(
              "px-4 py-1 rounded-full capitalize text-sm font-medium transition-all cursor-pointer",
              mode === m ? "bg-black/20 text-white font-bold" : "text-white/70 hover:bg-black/10"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-[8rem] leading-none font-bold text-white mb-8 font-mono drop-shadow-lg">
        {formatTime(timeLeft)}
      </div>

      {/* Main Controls */}
      <div className="flex gap-4 mb-12 z-10">
        <button 
            onClick={isRunning ? handlePause : handleStart}
            className="px-8 py-4 text-2xl font-bold rounded-lg shadow-xl cursor-pointer transition-transform active:scale-95 uppercase w-48 bg-white text-[var(--theme-primary)] hover:bg-gray-100"
        >
            {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button 
            onClick={handleReset}
            className="px-4 py-4 text-2xl font-bold rounded-lg shadow-xl cursor-pointer transition-transform active:scale-95 bg-white/20 text-white hover:bg-white/30"
        >
            ↺
        </button>
      </div>

      {/* Task Section */}
      <TaskBoard />
    </div>
  );
}

export default App;
