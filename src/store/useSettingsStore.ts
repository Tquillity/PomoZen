import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimerMode } from '../types';

interface SettingsState {
  durations: Record<TimerMode, number>;
  autoStart: boolean;
  soundEnabled: boolean;
  isFocusMode: boolean;
  
  updateDuration: (mode: TimerMode, minutes: number) => void;
  toggleAutoStart: () => void;
  toggleSound: () => void;
  toggleFocusMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      durations: { pomodoro: 25, short: 5, long: 15 },
      autoStart: false,
      soundEnabled: true,
      isFocusMode: false,

      updateDuration: (mode, minutes) => set((state) => ({
        durations: { ...state.durations, [mode]: minutes }
      })),
      toggleAutoStart: () => set((state) => ({ autoStart: !state.autoStart })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
    }),
    { 
      name: 'pomo-settings-storage',
      partialize: (state) => ({ 
        durations: state.durations, 
        autoStart: state.autoStart, 
        soundEnabled: state.soundEnabled 
      }), // Don't persist Focus Mode
    }
  )
);

