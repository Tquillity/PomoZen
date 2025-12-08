import * as Comlink from 'comlink';
import type { TimerWorkerAPI } from '../types/worker-types';

// Singleton instance
let workerInstance: Comlink.Remote<TimerWorkerAPI> | null = null;

export const getWorker = () => {
  if (!workerInstance) {
    const worker = new Worker(new URL('../workers/timer.worker.ts', import.meta.url), {
      type: 'module',
    });
    workerInstance = Comlink.wrap<TimerWorkerAPI>(worker);
  }
  return workerInstance;
};

