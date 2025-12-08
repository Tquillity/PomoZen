import { useEffect, useRef, useState } from 'react';
import * as Comlink from 'comlink';
import type { TimerWorkerAPI } from './types/worker-types';

function App() {
  // We keep the worker instance in a ref so it doesn't recreate on re-renders
  const workerRef = useRef<Comlink.Remote<TimerWorkerAPI> | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 1. Init Worker
    const worker = new Worker(new URL('./workers/timer.worker.ts', import.meta.url), {
      type: 'module',
    });
    
    // 2. Wrap with Comlink
    workerRef.current = Comlink.wrap<TimerWorkerAPI>(worker);

    return () => {
      worker.terminate();
    };
  }, []);

  const handleStart = async () => {
    if (workerRef.current) {
      // 3. Pass a proxy callback to the worker
      // The worker calls this function every second
      await workerRef.current.start(
        Comlink.proxy((val: number) => setCount(val))
      );
    }
  };

  const handlePause = async () => {
    await workerRef.current?.pause();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white space-y-6">
      <h1 className="text-4xl font-bold text-red-500">Worker Test</h1>
      <div className="text-6xl font-mono">{count}</div>
      <div className="flex gap-4">
        <button 
          onClick={handleStart}
          className="px-6 py-2 bg-green-600 rounded hover:bg-green-500 cursor-pointer"
        >
          Start
        </button>
        <button 
          onClick={handlePause}
          className="px-6 py-2 bg-yellow-600 rounded hover:bg-yellow-500 cursor-pointer"
        >
          Pause
        </button>
      </div>
    </div>
  );
}

export default App;
