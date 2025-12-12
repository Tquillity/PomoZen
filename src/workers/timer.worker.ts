import * as Comlink from 'comlink';
import type { TimerWorkerAPI } from '../types/worker-types';

let timerId: number | null = null;
let expectedTime: number = 0;

const api: TimerWorkerAPI = {
  start(callback) {
    if (timerId) return;

    // 1. Set the baseline time
    expectedTime = Date.now() + 1000;

    // 2. Initial Tick immediately (optional, or wait for first interval)
    // callback(0);

    const tick = () => {
      const now = Date.now();
      const drift = now - expectedTime; // Calculate how far we drifted
      // If drift is massive (e.g., tab was suspended for minutes),
      // you might want to handle that differently.
      // For now, we just acknowledge the tick.
      callback(0);
      expectedTime += 1000;

      // 3. Schedule next tick, subtracting the drift from the 1000ms delay
      // Math.max(0, ...) ensures we don't pass a negative number
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