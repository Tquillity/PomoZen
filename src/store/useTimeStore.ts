/**
 * @fileoverview Timer state management store using Zustand with persistence.
 * 
 * Manages timer state including time remaining, running status, mode, completion history,
 * and automatic mode switching based on Pomodoro technique rules.
 * 
 * @module useTimeStore
 */

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
import { getDuration } from '../utils/timerDefaults';

const POMODOROS_PER_SET = 4;

/**
 * Daily statistics tracking pomodoros and breaks completed.
 */
interface DailyStats {
  pomodoro: number;
  short: number;
  long: number;
}

/**
 * Timer state interface.
 * 
 * @interface TimeState
 * @property {number} timeLeft - Remaining time in seconds
 * @property {boolean} isRunning - Whether timer is currently running
 * @property {TimerMode} mode - Current timer mode (pomodoro, short, long)
 * @property {number} pomodorosCompleted - Total pomodoros completed in current session
 * @property {Record<string, DailyStats>} history - Daily completion history keyed by date (YYYY-MM-DD)
 * @property {() => Promise<void>} startTimer - Start the timer
 * @property {() => void} pauseTimer - Pause the timer
 * @property {() => void} resetTimer - Reset timer to initial duration for current mode
 * @property {(mode: TimerMode) => void} setMode - Change timer mode and reset
 * @property {(mode: TimerMode) => void} switchModeWithSkip - Skip current session and switch modes while maintaining cycle position
 * @property {() => void} tick - Decrement timer (called by worker)
 */
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
  switchModeWithSkip: (mode: TimerMode) => void;
  tick: () => void;
}

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
        try {
          await getWorker().start(Comlink.proxy(() => get().tick()));
        } catch {
          set({ isRunning: false });
        }
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

      switchModeWithSkip: (targetMode) => {
        const { mode, pomodorosCompleted } = get();

        const shouldIncrement =
          mode === 'pomodoro' && targetMode !== 'pomodoro';

        set({
          pomodorosCompleted: shouldIncrement ? pomodorosCompleted + 1 : pomodorosCompleted,
          mode: targetMode,
          isRunning: false,
          timeLeft: getDuration(targetMode),
        });

        getWorker().reset();
      },

      tick: (elapsedSeconds: number = 1) => {
        const { timeLeft, mode, pomodorosCompleted, history } = get();
        
        const newTimeLeft = Math.max(0, timeLeft - elapsedSeconds);
        
        if (newTimeLeft > 0) {
          set({ timeLeft: newTimeLeft });
          return;
        }

        set({ timeLeft: 0 });
        get().pauseTimer();
        events.emit('timer:complete', mode);
        
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
