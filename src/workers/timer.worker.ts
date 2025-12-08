import * as Comlink from 'comlink';
import type { TimerWorkerAPI } from '../types/worker-types';

let intervalId: number | null = null;

const api: TimerWorkerAPI = {
  start(callback) {
    if (intervalId) return;
    
    // Initial Tick
    callback(0); // Value doesn't matter, it's just a pulse

    intervalId = self.setInterval(() => {
      callback(0);
    }, 1000);
  },

  pause() {
    if (intervalId) {
      self.clearInterval(intervalId);
      intervalId = null;
    }
  },

  reset() {
    this.pause();
  }
};

Comlink.expose(api);
