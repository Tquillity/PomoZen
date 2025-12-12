import * as Comlink from 'comlink';
import type { TimerWorkerAPI } from '../types/worker-types';

let timerId: number | null = null;
let expectedTime: number = 0;

const api: TimerWorkerAPI = {
  start(callback) {
    if (timerId) return;

    // Always reset baseline on start/resume to prevent drift accumulation
    // after pause. We only care about drift relative to the current start time.
    expectedTime = Date.now() + 1000;

    const tick = () => {
      const now = Date.now();
      const drift = now - expectedTime;
      
      // Safety: If drift is excessive (e.g., system sleep), reset baseline
      if (drift > 1000) {
        expectedTime = now + 1000;
        callback(0);
      } else {
        callback(0);
        expectedTime += 1000;
      }
      
      timerId = self.setTimeout(tick, Math.max(0, 1000 - drift));
    };

    timerId = self.setTimeout(tick, 1000);
  },

  pause() {
    if (timerId) {
      self.clearTimeout(timerId);
      timerId = null;
    }
  },

  reset() {
    this.pause();
    expectedTime = 0;
  }
};

Comlink.expose(api);