import * as Comlink from 'comlink';
import type { TimerWorkerAPI } from '../types/worker-types';

let intervalId: number | null = null;
let seconds = 0; // Just a counter for now

const api: TimerWorkerAPI = {
  start(callback) {
    if (intervalId) return; // Already running

    // Tick immediately
    callback(seconds);

    intervalId = self.setInterval(() => {
      seconds++;
      callback(seconds);
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
    seconds = 0;
  }
};

Comlink.expose(api);

