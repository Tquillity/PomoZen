import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as Comlink from 'comlink';
import { getWorker } from '../services/worker.service';
import type { TimerMode } from '../types';
import { events } from '../services/event.service';
import { useSettingsStore } from './useSettingsStore';
import { useTaskStore } from './useTaskStore';
import { format } from 'date-fns';
import { createSafeStorage } from '../utils/storageWrapper';

const POMODOROS_PER_SET = 4;

interface DailyStats {
  pomodoro: number;
  short: number;
  long: number;
}

interface TimeState {
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  pomodorosCompleted: number;
  history: Record<string, DailyStats>;
  
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setMode: (mode: TimerMode) => void;
  tick: () => void;
}

const getDuration = (mode: TimerMode) => {
  return useSettingsStore.getState().durations[mode] * 60;
};

export const useTimeStore = create<TimeState>()(
  persist(
    (set, get) => ({
      timeLeft: getDuration('pomodoro'),
      isRunning: false,
      mode: 'pomodoro',
      pomodorosCompleted: 0,
      history: {},

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
        const { timeLeft, mode, pomodorosCompleted, history } = get();
        
        if (timeLeft > 1) {
          set({ timeLeft: timeLeft - 1 });
          return;
        }

        if (timeLeft === 1) {
          set({ timeLeft: 0 });
        }

        if (timeLeft <= 1) {
          get().pauseTimer();
          events.emit('timer:complete', mode);
          
          // Update task pomodoro count when pomodoro completes
          if (mode === 'pomodoro') {
            const activeId = useTaskStore.getState().activeTaskId;
            if (activeId) {
              useTaskStore.getState().updateActPomo(activeId);
            }
          }
          
          const todayKey = format(new Date(), 'yyyy-MM-dd');
          const currentStats = history[todayKey] || { pomodoro: 0, short: 0, long: 0 };
          
          const newHistory = { 
            ...history, 
            [todayKey]: { 
              ...currentStats, 
              [mode]: currentStats[mode] + 1 
            } 
          };
          
          if (mode === 'pomodoro') {
             const newCompleted = pomodorosCompleted + 1;
             const nextMode = newCompleted % POMODOROS_PER_SET === 0 ? 'long' : 'short';
             
             set({ 
               pomodorosCompleted: newCompleted, 
               mode: nextMode,
               timeLeft: getDuration(nextMode),
               history: newHistory
             });
          } else {
             set({ 
               mode: 'pomodoro',
               timeLeft: getDuration('pomodoro'),
               history: newHistory
             });
          }
          
          const { autoStart } = useSettingsStore.getState();
          if (autoStart) {
            get().startTimer();
          }
        }
      }
    }),
    { 
      name: 'pomo-time-storage',
      version: 2,
      storage: createJSONStorage(() => createSafeStorage()),
      migrate: (persistedState: unknown, version: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state = persistedState as any;

        if (version === 0 || version === 1) {
          const newHistory: Record<string, DailyStats> = {};
          if (state.history) {
            Object.entries(state.history).forEach(([date, count]) => {
              newHistory[date] = { pomodoro: count as number, short: 0, long: 0 };
            });
          }
          return { ...state, history: newHistory };
        }
        return state;
      },
    }
  )
);
