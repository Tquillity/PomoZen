import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as Comlink from 'comlink';
import { getWorker } from '../services/worker.service';
import type { TimerMode } from '../types';
import { events } from '../services/event.service';
import { useSettingsStore } from './useSettingsStore';

interface TimeState {
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  pomodorosCompleted: number;
  
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setMode: (mode: TimerMode) => void;
  tick: () => void;
}

// Helper to get duration in seconds from settings
const getDuration = (mode: TimerMode) => {
  return useSettingsStore.getState().durations[mode] * 60;
};

export const useTimeStore = create<TimeState>()(
  persist(
    (set, get) => ({
      // Initialize with default or current settings
      timeLeft: getDuration('pomodoro'),
      isRunning: false,
      mode: 'pomodoro',
      pomodorosCompleted: 0,

      startTimer: async () => {
        const { isRunning } = get();
        if (isRunning) return;
        set({ isRunning: true });
        await getWorker().start(Comlink.proxy(() => get().tick()));
      },

      pauseTimer: () => {
        set({ isRunning: false });
        getWorker().pause();
      },

      resetTimer: () => {
        const { mode } = get();
        set({ isRunning: false, timeLeft: getDuration(mode) });
        getWorker().reset();
      },

      setMode: (mode) => {
        set({ mode, isRunning: false, timeLeft: getDuration(mode) });
        getWorker().reset();
      },

      tick: () => {
        const { timeLeft, mode, pomodorosCompleted } = get();
        
        if (timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else {
          // Timer Finished
          get().pauseTimer();
          
          // Emit event instead of calling side effects directly
          events.emit('timer:complete', mode);
          
          if (mode === 'pomodoro') {
             const newCompleted = pomodorosCompleted + 1;
             const nextMode = newCompleted % 4 === 0 ? 'long' : 'short';
             
             set({ 
               pomodorosCompleted: newCompleted, 
               mode: nextMode,
               timeLeft: getDuration(nextMode)
             });
          } else {
             // Break is over, back to work
             set({ 
               mode: 'pomodoro',
               timeLeft: getDuration('pomodoro')
             });
          }
          
          // Auto-start logic
          const { autoStart } = useSettingsStore.getState();
          if (autoStart) {
            get().startTimer();
          }
        }
      }
    }),
    { name: 'pomo-time-storage' }
  )
);
