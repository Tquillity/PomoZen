import { useTimeStore } from './store/useTimeStore';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

function App() {
  const { timeLeft, startTimer, pauseTimer, resetTimer, isRunning } = useTimeStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white space-y-8">
      <h1 className="text-4xl font-bold text-red-500">PomoZen</h1>
      
      {/* Timer Display */}
      <div className="text-9xl font-mono font-bold tracking-wider">
        {formatTime(timeLeft)}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button 
            onClick={startTimer}
            className="px-8 py-3 text-xl font-bold bg-white text-red-500 rounded-lg shadow-lg hover:bg-gray-100 cursor-pointer transition-transform active:scale-95"
          >
            START
          </button>
        ) : (
          <button 
            onClick={pauseTimer}
            className="px-8 py-3 text-xl font-bold bg-red-800 text-white rounded-lg shadow-lg hover:bg-red-700 cursor-pointer transition-transform active:scale-95"
          >
            PAUSE
          </button>
        )}
        
        <button 
          onClick={resetTimer}
          className="px-8 py-3 text-xl font-bold border-2 border-white/20 text-white rounded-lg hover:bg-white/10 cursor-pointer transition-transform active:scale-95"
        >
          RESET
        </button>
      </div>
    </div>
  );
}

export default App;
