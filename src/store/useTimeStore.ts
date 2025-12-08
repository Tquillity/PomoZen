import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as Comlink from 'comlink';
import { getWorker } from '../services/worker.service';
import type { TimerMode } from '../types';
import { useTaskStore } from './useTaskStore'; // To update tasks
import { playAlarm, sendNotification } from '../services/sound.service';

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

const TIMES = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

export const useTimeStore = create<TimeState>()(
  persist(
    (set, get) => ({
      timeLeft: TIMES.pomodoro,
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
        set({ isRunning: false, timeLeft: TIMES[mode] });
        getWorker().reset();
      },

      setMode: (mode) => {
        set({ mode, isRunning: false, timeLeft: TIMES[mode] });
        getWorker().reset();
      },

      tick: () => {
        const { timeLeft, mode, pomodorosCompleted } = get();
        
        if (timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else {
          // Timer Finished
          get().pauseTimer();
          playAlarm();
          
          if (mode === 'pomodoro') {
             sendNotification("Break Time!", "Great job! Take a short break.");
             // Logic: Check for active task and increment its counter
             const activeTaskId = useTaskStore.getState().activeTaskId;
             if (activeTaskId) {
               useTaskStore.getState().updateActPomo(activeTaskId);
             }

             const newCompleted = pomodorosCompleted + 1;
             const nextMode = newCompleted % 4 === 0 ? 'long' : 'short';
             
             set({ 
               pomodorosCompleted: newCompleted, 
               mode: nextMode,
               timeLeft: TIMES[nextMode]
             });
          } else {
             sendNotification("Back to Work!", "Break is over. Let's focus.");
             // Break is over, back to work
             set({ 
               mode: 'pomodoro',
               timeLeft: TIMES.pomodoro
             });
          }
        }
      }
    }),
    { name: 'pomo-time-storage' }
  )
);
