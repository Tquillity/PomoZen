import { useTimeStore } from './store/useTimeStore';
import { TaskBoard } from './components/TaskBoard';
import clsx from 'clsx';
import type { TimerMode } from './types';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

function App() {
  const { timeLeft, isRunning, mode, startTimer, pauseTimer, resetTimer, setMode } = useTimeStore();

  const getBgColor = () => {
    switch(mode) {
        case 'short': return 'bg-teal-700';
        case 'long': return 'bg-indigo-700';
        default: return 'bg-red-700';
    }
  };

  return (
    <div className={clsx("min-h-screen transition-colors duration-500 flex flex-col items-center py-12", getBgColor())}>
      
      {/* Mode Switcher */}
      <div className="flex gap-2 mb-8 bg-black/20 p-1 rounded-full">
        {(['pomodoro', 'short', 'long'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={clsx(
              "px-4 py-1 rounded-full capitalize text-sm font-medium transition-all cursor-pointer",
              mode === m ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-[8rem] leading-none font-bold text-white mb-8 font-mono">
        {formatTime(timeLeft)}
      </div>

      {/* Main Controls */}
      <div className="flex gap-4 mb-12">
        <button 
            onClick={isRunning ? pauseTimer : startTimer}
            className={clsx(
              "px-8 py-4 text-2xl font-bold rounded-lg shadow-xl cursor-pointer transition-transform active:scale-95 uppercase w-48",
              isRunning ? "bg-white/20 text-white" : "bg-white text-gray-800"
            )}
        >
            {isRunning ? 'Pause' : 'Start'}
        </button>
        
        {/* Reset Button (Small) */}
         <button 
            onClick={resetTimer}
            className="px-4 py-4 text-2xl font-bold rounded-lg shadow-xl cursor-pointer transition-transform active:scale-95 bg-white/20 text-white"
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
