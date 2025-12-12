import * as Comlink from 'comlink';
import type { TimerWorkerAPI } from '../types/worker-types';

let workerInstance: Comlink.Remote<TimerWorkerAPI> | null = null;

export const getWorker = () => {
  if (!workerInstance) {
    const worker = new Worker(new URL('../workers/timer.worker.ts', import.meta.url), {
      type: 'module',
    });
    
    worker.onerror = () => {
      workerInstance = null;
    };
    
    worker.addEventListener('error', () => {
      workerInstance = null;
    });
    
    workerInstance = Comlink.wrap<TimerWorkerAPI>(worker);
  }
  return workerInstance;
};

