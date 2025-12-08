import { create } from 'zustand';
import * as Comlink from 'comlink';
import { getWorker } from '../services/worker.service';

interface TimeState {
  timeLeft: number;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
}

export const useTimeStore = create<TimeState>((set, get) => ({
  timeLeft: 25 * 60,
  isRunning: false,

  startTimer: async () => {
    const { isRunning } = get();
    if (isRunning) return;

    set({ isRunning: true });
    
    const worker = getWorker();
    // Proxy the tick function so the worker can call it
    await worker.start(
      Comlink.proxy(() => {
        get().tick();
      })
    );
  },

  pauseTimer: () => {
    set({ isRunning: false });
    getWorker().pause();
  },

  resetTimer: () => {
    set({ isRunning: false, timeLeft: 25 * 60 });
    getWorker().reset();
  },

  tick: () => {
    const { timeLeft } = get();
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else {
      // Timer finished
      get().pauseTimer();
    }
  }
}));

