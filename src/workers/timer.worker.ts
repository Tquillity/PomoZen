import * as Comlink from 'comlink';
import type { TimerWorkerAPI } from '../types/worker-types';

let timerId: number | null = null;
let expectedTime: number = 0;

const api: TimerWorkerAPI = {
  start(callback) {
    if (timerId) return;

    expectedTime = Date.now() + 1000;

    const tick = () => {
      const now = Date.now();
      const drift = now - expectedTime;
      callback(0);
      expectedTime += 1000;
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